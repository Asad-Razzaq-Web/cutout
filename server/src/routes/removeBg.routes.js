import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { removeBg } from '../controllers/removeBg.controller.js';
import { optionalAuth } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';

const router = Router();

// Guests are limited harder than logged-in users to protect your API credits.
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: (req) => (req.user ? 100 : 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Hourly limit reached. Log in for a higher limit or try again later.' },
});

router.post('/', optionalAuth, limiter, uploadImage, removeBg);

export default router;
