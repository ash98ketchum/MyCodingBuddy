import express from 'express';
import { adminProgramController } from '../controllers/admin-program.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// All program routes are protected and strictly admin-only
router.use(authenticate);
router.use(requireAdmin);

// Bloom Filter API
router.get('/bloom', adminProgramController.getBloomFilter);

// Student Verification API
router.get('/students/verify', adminProgramController.verifyStudent);

// Problems Listing API
router.get('/problems', adminProgramController.getProblems);

// Assignment API
router.post('/assign', adminProgramController.assignProblem);

export default router;
