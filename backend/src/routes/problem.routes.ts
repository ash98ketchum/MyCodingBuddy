// backend/src/routes/problem.routes.ts
import { Router } from 'express';
import {
  getProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemStats,
  getGlobalStats,
} from '@/controllers/problem.controller';
import { authenticate, requireAdmin } from '@/middleware/auth';

const router = Router();

router.get('/global-stats', getGlobalStats);
router.get('/', getProblems);
router.get('/stats', getProblemStats);
router.get('/:slug', getProblem);
router.post('/', authenticate, requireAdmin, createProblem);
router.put('/:id', authenticate, requireAdmin, updateProblem);
router.delete('/:id', authenticate, requireAdmin, deleteProblem);

export default router;
