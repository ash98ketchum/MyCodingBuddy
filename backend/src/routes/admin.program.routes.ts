import { Router } from 'express';
import { ProgramController } from '../controllers/admin.program.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Protect all routes
router.use(authenticate);
router.use(requireAdmin);

// Program Management
router.post('/', ProgramController.createProgram);
router.get('/', ProgramController.getAllPrograms);
router.get('/:id', ProgramController.getProgramById);

// Student Import
router.post('/:id/students', ProgramController.importStudents);

// Problem Pool
router.post('/:id/pool', ProgramController.addProblems);

// Manual Triggers
router.post('/:id/assignment', ProgramController.triggerAssignment);
router.post('/:id/report', ProgramController.triggerReport);

export default router;
