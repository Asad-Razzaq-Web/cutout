import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { trackPageView } from '../controllers/track.controller.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();
const limiter = rateLimit({ windowMs: 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false });

router.post('/', limiter, optionalAuth, trackPageView);

export default router;