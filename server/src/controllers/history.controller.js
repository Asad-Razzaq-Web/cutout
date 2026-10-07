import mongoose from 'mongoose';
import History from '../models/History.js';
import { safeUnlink } from '../utils/files.js';

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
