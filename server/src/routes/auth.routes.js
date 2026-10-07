import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, me, signup } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Try again in a few minutes.' },
});

router.post('/signup', limiter, signup);
router.post('/login', limiter, login);
router.get('/me', requireAuth, me);

export default router;
