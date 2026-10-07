import { Router } from 'express';
import {
  activity, deleteUser, exportUsers, listUsers, overview, system, timeseries, updateUser,
} from '../controllers/admin.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, requireAdmin);

router.get('/overview', overview);
router.get('/timeseries', timeseries);
router.get('/users', listUsers);
router.get('/users/export', exportUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/activity', activity);
router.get('/system', system);

export default router;