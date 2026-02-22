import { Request, Response } from 'express';
import { ProgramService } from '../services/program.service';
import { AssignmentService } from '../services/assignment.service';
import { ReportService } from '../services/report.service';

export class ProgramController {

    static async createProgram(req: Request, res: Response) {
        try {
            const { name, startDate, endDate } = req.body;
            const adminId = req.user!.userId; // Assuming auth middleware sets req.user

            const program = await ProgramService.createProgram({
                name,
                adminId,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : undefined
            });

            res.status(201).json(program);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllPrograms(req: Request, res: Response) {
        try {
            const programs = await ProgramService.getAllPrograms();
            res.json(programs);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getProgramById(req: Request, res: Response) {
        try {
            const program = await ProgramService.getProgramById(req.params.id as string);
            if (!program) return res.status(404).json({ error: 'Program not found' });
            res.json(program);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async importStudents(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { csvContent } = req.body; // Expecting raw CSV string in body

            if (!csvContent) {
                return res.status(400).json({ error: 'csvContent is required' });
            }

            const results = await ProgramService.importStudents(id, csvContent);
            res.json(results);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async addProblems(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { problemIds, difficulty } = req.body;

            if (!Array.isArray(problemIds) || !difficulty) {
                return res.status(400).json({ error: 'Invalid input' });
            }

            const result = await ProgramService.addProblemsToPool(id, problemIds, difficulty);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async triggerAssignment(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const result = await AssignmentService.runDailyAssignment(id);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async triggerReport(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const result = await ReportService.generateDailyReports(id);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
