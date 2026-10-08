import { Router } from 'express';
import { deleteHistory, listHistory, saveHistory } from '../controllers/history.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadPair } from '../middleware/upload.js';

const router = Router();
router.use(requireAuth);
router.get('/', listHistory);
router.post('/', uploadPair, saveHistory);
router.delete('/:id', deleteHistory);

export default router;