// backend/src/routes/admin.routes.ts
import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllSubmissions,
  createAdminUser,
  getSystemHealth,
  getAllSubscriptions,
  updateSubscription,
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
router.get('/subscriptions', getAllSubscriptions);
router.put('/subscriptions/:id', updateSubscription);

export default router;
