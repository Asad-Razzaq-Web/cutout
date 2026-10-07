import fs from 'node:fs/promises';
import mongoose from 'mongoose';
import path from 'node:path';
import { UPLOAD_DIR } from '../config/paths.js';
import History from '../models/History.js';
import PageView from '../models/PageView.js';
import Usage from '../models/Usage.js';
import User from '../models/User.js';
import { safeUnlink } from '../utils/files.js';

const DAY = 24 * 60 * 60 * 1000;
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const startOfDay = (d = new Date()) => {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
};
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const uniqueVisitors = async (since) => {
  const [r] = await PageView.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: '$visitorId' } },
    { $count: 'n' },
  ]);
  return r?.n || 0;
};

const activeUsers = async (since) => {
  const [r] = await Usage.aggregate([
    { $match: { createdAt: { $gte: since }, userId: { $ne: null }, status: 'success' } },
    { $group: { _id: '$userId' } },
    { $count: 'n' },
  ]);
  return r?.n || 0;
};

export const overview = wrap(async (_req, res) => {
  const now = new Date();
  const today = startOfDay();
  const d7 = new Date(today - 6 * DAY);
  const d30 = new Date(today - 29 * DAY);
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const [
    totalUsers, usersToday, users7, disabledUsers, active7,
    imagesTotal, imagesToday, images7, failed7, guest30, member30, callsMonth,
    pageviews30, visitorsToday, visitors30, topPages,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: today } }),
    User.countDocuments({ createdAt: { $gte: d7 } }),
    User.countDocuments({ disabled: true }),
    activeUsers(d7),
    Usage.countDocuments({ status: 'success' }),
    Usage.countDocuments({ status: 'success', createdAt: { $gte: today } }),
    Usage.countDocuments({ status: 'success', createdAt: { $gte: d7 } }),
    Usage.countDocuments({ status: 'failed', createdAt: { $gte: d7 } }),
    Usage.countDocuments({ status: 'success', userId: null, createdAt: { $gte: d30 } }),
    Usage.countDocuments({ status: 'success', userId: { $ne: null }, createdAt: { $gte: d30 } }),
    Usage.countDocuments({ createdAt: { $gte: monthStart } }),
    PageView.countDocuments({ createdAt: { $gte: d30 } }),
    uniqueVisitors(today),
    uniqueVisitors(d30),
    PageView.aggregate([
      { $match: { createdAt: { $gte: d30 } } },
      { $group: { _id: '$path', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 8 },
      { $project: { _id: 0, path: '$_id', views: 1 } },
    ]),
  ]);

  const attempts7 = images7 + failed7;
  res.json({
    users: { total: totalUsers, today: usersToday, last7: users7, disabled: disabledUsers, active7 },
    images: { total: imagesTotal, today: imagesToday, last7: images7, guest30, member30 },
    processing: {
      failed7,
      successRate7: attempts7 ? images7 / attempts7 : null,
      callsThisMonth: callsMonth,
    },
    traffic: { pageviews30, visitorsToday, visitors30 },
    topPages,
  });
});

export const timeseries = wrap(async (req, res) => {
  const days = Math.min(Math.max(Number(req.query.days) || 30, 7), 90);
  const since = new Date(startOfDay().getTime() - (days - 1) * DAY);
  const day = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };

  const [signups, usage, views] = await Promise.all([
    User.aggregate([{ $match: { createdAt: { $gte: since } } }, { $group: { _id: day, n: { $sum: 1 } } }]),
    Usage.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { day, status: '$status' }, n: { $sum: 1 } } },
    ]),
    PageView.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { day, v: '$visitorId' }, n: { $sum: 1 } } },
      { $group: { _id: '$_id.day', visitors: { $sum: 1 }, pageviews: { $sum: '$n' } } },
    ]),
  ]);

  const map = {};
  for (let i = 0; i < days; i++) {
    const date = new Date(since.getTime() + i * DAY).toISOString().slice(0, 10);
    map[date] = { date, signups: 0, processed: 0, failed: 0, visitors: 0, pageviews: 0 };
  }
  signups.forEach((r) => map[r._id] && (map[r._id].signups = r.n));
  usage.forEach((r) => map[r._id.day] && (map[r._id.day][r._id.status === 'success' ? 'processed' : 'failed'] = r.n));
  views.forEach((r) => map[r._id] && Object.assign(map[r._id], { visitors: r.visitors, pageviews: r.pageviews }));

  res.json({ points: Object.values(map) });
});

export const listUsers = wrap(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const q = String(req.query.search || '').trim();
  const filter = q
    ? { $or: [{ email: { $regex: escapeRegex(q), $options: 'i' } }, { name: { $regex: escapeRegex(q), $options: 'i' } }] }
    : {};

  const [total, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
  ]);

  const counts = await History.aggregate([
    { $match: { userId: { $in: users.map((u) => u._id) } } },
    { $group: { _id: '$userId', n: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));

  res.json({
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    items: users.map((u) => ({
      _id: u._id,
      email: u.email,
      name: u.name,
      role: u.role,
      disabled: u.disabled,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
      imageCount: countMap[String(u._id)] || 0,
    })),
  });
});

export const updateUser = wrap(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id.' });

  const update = {};
  if (typeof req.body.disabled === 'boolean') update.disabled = req.body.disabled;
  if (['user', 'admin'].includes(req.body.role)) update.role = req.body.role;
  if (!Object.keys(update).length) return res.status(400).json({ message: 'Nothing to update.' });

  if (id === req.user.id && (update.disabled === true || update.role === 'user'))
    return res.status(400).json({ message: 'You cannot disable or demote your own account.' });

  const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json({ ok: true });
});

export const deleteUser = wrap(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id.' });
  if (id === req.user.id) return res.status(400).json({ message: 'You cannot delete your own account.' });

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const items = await History.find({ userId: id }).lean();
  await Promise.all(items.flatMap((i) => [safeUnlink(i.originalImageUrl), safeUnlink(i.processedImageUrl)]));
  await fs.rm(path.join(UPLOAD_DIR, 'users', id), { recursive: true, force: true });
  await Promise.all([
    History.deleteMany({ userId: id }),
    Usage.updateMany({ userId: id }, { $set: { userId: null } }), // keep global stats intact
    User.deleteOne({ _id: id }),
  ]);
  res.json({ ok: true });
});

export const activity = wrap(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const items = await Usage.find().sort({ createdAt: -1 }).limit(limit).populate('userId', 'email').lean();
  res.json({
    items: items.map((i) => ({
      _id: i._id,
      createdAt: i.createdAt,
      status: i.status,
      bytes: i.bytes,
      error: i.error,
      email: i.userId?.email || null,
    })),
  });
});

async function dirSize(dir) {
  let size = 0;
  let files = 0;
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      const r = await dirSize(p);
      size += r.size;
      files += r.files;
    } else {
      const s = await fs.stat(p).catch(() => null);
      if (s) {
        size += s.size;
        files += 1;
      }
    }
  }
  return { size, files };
}

export const system = wrap(async (_req, res) => {
  const { size, files } = await dirSize(UPLOAD_DIR);
  const provider = process.env.BG_PROVIDER || 'removebg';
  const key = provider === 'clipdrop' ? process.env.CLIPDROP_API_KEY : process.env.REMOVEBG_API_KEY;
  res.json({
    storageBytes: size,
    files,
    uptimeSeconds: Math.round(process.uptime()),
    memoryMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    node: process.version,
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    provider,
    providerConfigured: Boolean(key),
    maxFileMb: Number(process.env.MAX_FILE_MB || 10),
  });
});

// Prevents spreadsheet formula injection when the CSV is opened in Excel
const csvCell = (v) => {
  let s = v == null ? '' : v instanceof Date ? v.toISOString() : String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export const exportUsers = wrap(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  const rows = [['email', 'name', 'role', 'disabled', 'createdAt', 'lastLoginAt']];
  users.forEach((u) => rows.push([u.email, u.name, u.role, u.disabled, u.createdAt, u.lastLoginAt]));
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
  res.send(rows.map((r) => r.map(csvCell).join(',')).join('\n'));
});