import { Router } from 'express';
import { deleteHistory, listHistory } from '../controllers/history.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/', listHistory);
router.delete('/:id', deleteHistory);

export default router;
