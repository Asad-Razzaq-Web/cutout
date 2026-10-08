import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import mongoose from 'mongoose';
import path from 'node:path';
import { UPLOAD_DIR } from '../config/paths.js';
import History from '../models/History.js';
import Usage from '../models/Usage.js';
import { safeUnlink, toPublicUrl } from '../utils/files.js';

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export async function listHistory(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 24, 60);
    const items = await History.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

/** Saves a result that was produced in the browser (original + transparent PNG). */
export async function saveHistory(req, res, next) {
  try {
    const original = req.files?.original?.[0];
    const processed = req.files?.processed?.[0];
    if (!original || !processed)
      return res.status(400).json({ message: 'Send both "original" and "processed" images.' });
    if (processed.mimetype !== 'image/png')
      return res.status(400).json({ message: 'The processed image must be a PNG.' });

    const folder = `users/${req.user.id}`;
    const id = crypto.randomUUID();
    const originalRel = `${folder}/${id}-original.${EXT[original.mimetype]}`;
    const processedRel = `${folder}/${id}-processed.png`;

    await fs.mkdir(path.join(UPLOAD_DIR, folder), { recursive: true });
    await Promise.all([
      fs.writeFile(path.join(UPLOAD_DIR, originalRel), original.buffer),
      fs.writeFile(path.join(UPLOAD_DIR, processedRel), processed.buffer),
    ]);

    const doc = await History.create({
      userId: req.user.id,
      originalImageUrl: toPublicUrl(originalRel),
      processedImageUrl: toPublicUrl(processedRel),
    });
    Usage.create({ userId: req.user.id, status: 'success', bytes: original.size }).catch(() => {});

    res.status(201).json({ historyId: doc._id });
  } catch (err) {
    next(err);
  }
}

export async function deleteHistory(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: 'Invalid id.' });
    const doc = await History.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ message: 'Item not found.' });
    await Promise.all([safeUnlink(doc.originalImageUrl), safeUnlink(doc.processedImageUrl)]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}