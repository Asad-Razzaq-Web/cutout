import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOAD_DIR } from '../config/paths.js';
import History from '../models/History.js';
import Usage from '../models/Usage.js';
import { removeBackground } from '../services/removeBg.service.js';
import { toPublicUrl } from '../utils/files.js';

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

const record = (data) => Usage.create(data).catch(() => {});

export async function removeBg(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'Attach an image in the "image" field.' });

    const { buffer, mimetype, originalname } = req.file;
    const processed = await removeBackground(buffer, mimetype, originalname);

    // Logged-in users get a permanent folder; guests get a temp folder that is cleaned hourly.
    const folder = req.user ? `users/${req.user.id}` : 'guest';
    const id = crypto.randomUUID();
    const originalRel = `${folder}/${id}-original.${EXT[mimetype]}`;
    const processedRel = `${folder}/${id}-processed.png`;

    await fs.mkdir(path.join(UPLOAD_DIR, folder), { recursive: true });
    await Promise.all([
      fs.writeFile(path.join(UPLOAD_DIR, originalRel), buffer),
      fs.writeFile(path.join(UPLOAD_DIR, processedRel), processed),
    ]);

    const originalImageUrl = toPublicUrl(originalRel);
    const processedImageUrl = toPublicUrl(processedRel);

    let historyId = null;
    if (req.user) {
      const doc = await History.create({
        userId: req.user.id,
        originalImageUrl,
        processedImageUrl,
      });
      historyId = doc._id;
    }

    record({ userId: req.user?.id || null, status: 'success', bytes: buffer.length });
    res.status(201).json({ originalImageUrl, processedImageUrl, saved: Boolean(req.user), historyId });
  } catch (err) {
    if (req.file) {
      record({
        userId: req.user?.id || null,
        status: 'failed',
        bytes: req.file.size,
        error: String(err.message || '').slice(0, 300),
      });
    }
    next(err);
  }
}