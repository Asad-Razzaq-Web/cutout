import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOAD_DIR } from '../config/paths.js';

const base = () => process.env.PUBLIC_BASE_URL || '';

export const toPublicUrl = (relPath) => `${base()}/uploads/${relPath}`;

/** Converts a stored URL back to an absolute path inside UPLOAD_DIR (null if it escapes). */
export function urlToFilePath(url) {
  const rel = url.replace(base(), '').replace(/^\/uploads\//, '');
  const abs = path.resolve(UPLOAD_DIR, rel);
  return abs.startsWith(UPLOAD_DIR + path.sep) ? abs : null;
}

export async function safeUnlink(url) {
  const abs = urlToFilePath(url);
  if (abs) await fs.unlink(abs).catch(() => {});
}

/** Deletes guest files older than maxAgeMs. Runs on an interval from index.js. */
export async function cleanGuestFiles(maxAgeMs = 60 * 60 * 1000) {
  const dir = path.join(UPLOAD_DIR, 'guest');
  const names = await fs.readdir(dir).catch(() => []);
  const now = Date.now();
  await Promise.all(
    names.map(async (name) => {
      const file = path.join(dir, name);
      const stat = await fs.stat(file).catch(() => null);
      if (stat && now - stat.mtimeMs > maxAgeMs) await fs.unlink(file).catch(() => {});
    })
  );
}
