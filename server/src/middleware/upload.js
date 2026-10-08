import multer from 'multer';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maxMb = Number(process.env.MAX_FILE_MB || 10);

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxMb * 1024 * 1024, files: 1 },
  fileFilter(_req, file, cb) {
    if (ALLOWED.has(file.mimetype)) return cb(null, true);
    const err = new Error('Only JPG, PNG and WebP images are supported.');
    err.status = 415;
    cb(err);
  },
}).single('image');



/** Two images at once (original + finished PNG) for saving browser-processed results. */
export const uploadPair = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024, files: 2 },
  fileFilter(_req, file, cb) {
    if (ALLOWED.has(file.mimetype)) return cb(null, true);
    const err = new Error('Only JPG, PNG and WebP images are supported.');
    err.status = 415;
    cb(err);
  },
}).fields([
  { name: 'original', maxCount: 1 },
  { name: 'processed', maxCount: 1 },
]);