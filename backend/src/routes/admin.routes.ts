import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllSubmissions,
  createAdminUser,
  getSystemHealth,
} from '@/controllers/admin.controller';
import { authenticate, requireAdmin } from '@/middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/submissions', getAllSubmissions);
router.post('/create-admin', createAdminUser);
router.get('/health', getSystemHealth);

export default router;
