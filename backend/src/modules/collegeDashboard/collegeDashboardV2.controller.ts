import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AIReportService } from './aiReport.service';
import { StudentKPIService } from './studentKPI.service';

const prisma = new PrismaClient();

export const collegeDashboardV2Controller = {
    // 1. GET /api/college/v2/:collegeId/dashboard
    // Instantly loads KPIs from the pre-aggregated StudentAnalytics table
    getDashboardKPIs: async (req: Request, res: Response) => {
        try {
            const collegeId = req.params.collegeId as string;

            // Using Prisma aggregation natively on the StudentAnalytics table
            const stats = await (prisma as any).studentAnalytics.aggregate({
                where: { student: { collegeId } },
                _avg: {
                    attemptEfficiency: true,
                    difficultyScore: true,
                    consistencyScore: true,
                    integrityScore: true,
                    avgSolveTime: true
                },
                _sum: {
                    totalSolved: true
                },
                _count: {
                    studentId: true
                }
            });

            // Count Active Today (using pre-calculated lastActiveAt)
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const activeToday = await (prisma as any).studentAnalytics.count({
                where: {
                    student: { collegeId },
                    lastActiveAt: { gte: today }
                }
            });

            res.json({
                success: true,
                data: {
                    totalStudents: stats._count.studentId || 0,
                    activeToday,
                    totalSolved: stats._sum.totalSolved || 0,
                    averageKPIs: {
                        efficiency: stats._avg.attemptEfficiency || 0,
                        difficulty: stats._avg.difficultyScore || 0,
                        consistency: stats._avg.consistencyScore || 0,
                        integrity: stats._avg.integrityScore || 100,
                        solveTime: stats._avg.avgSolveTime || 0
                    }
                }
            });
        } catch (error) {
            console.error('V2 KPI Error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch KPI dashboard' });
        }
    },

    // 2. GET /api/college/v2/:collegeId/students
    // Returns full list of students with their pre-calculated KPIs
    getStudentsList: async (req: Request, res: Response) => {
        try {
            const collegeId = req.params.collegeId as string;
            const students = await (prisma as any).collegeStudent.findMany({
                where: { collegeId },
                include: { studentAnalytics: true },
                orderBy: { studentAnalytics: { totalSolved: 'desc' } }
            });
            res.json({ success: true, data: students });
        } catch (error) {
            console.error('V2 Students Error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch students' });
        }
    },

    // 3. GET /api/college/v2/:collegeId/student/:studentId/report
    // Fetches existing AI report, or requests one from Groq if it's missing/stale
    getStudentAIReport: async (req: Request, res: Response) => {
        try {
            const studentId = req.params.studentId as string;

            let student: any = await (prisma as any).collegeStudent.findUnique({
                where: { id: studentId },
                include: { aiReport: true }
            });

            if (!student) {
                return res.status(404).json({ success: false, message: 'Student not found' });
            }

            // If report doesn't exist or is older than 7 days, regenerate it
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            if (!student.aiReport || student.aiReport.generatedAt < sevenDaysAgo) {
                // Ensure KPIs are up to date before asking AI
                await StudentKPIService.updateStudentAnalytics(studentId);
                // Call Groq AI
                await AIReportService.generateStudentReport(studentId);

                // Refetch
                student = await (prisma as any).collegeStudent.findUnique({
                    where: { id: studentId },
                    include: { aiReport: true }
                });
            }

            res.json({ success: true, data: student?.aiReport });
        } catch (error: any) {
            console.error('AI Report Error:', error);
            res.status(500).json({ success: false, message: error.message || 'AI Generation Failed' });
        }
    },

    // 4. GET /api/college/v2/:collegeId/section-performance
    getSectionPerformance: async (req: Request, res: Response) => {
        try {
            const collegeId = req.params.collegeId as string;

            // Group by section and average their metrics
            const sectionData = await (prisma as any).collegeStudent.groupBy({
                by: ['section'],
                where: { collegeId, section: { not: null } },
                _count: { id: true }
            });

            // For detailed metric per section, we map through
            const detailed = await Promise.all(sectionData.map(async (sec) => {
                const sectionKpis = await (prisma as any).studentAnalytics.aggregate({
                    where: { student: { collegeId, section: sec.section } },
                    _avg: { attemptEfficiency: true, totalSolved: true, consistencyScore: true }
                });
                return {
                    section: sec.section,
                    studentCount: sec._count.id,
                    avgEfficiency: sectionKpis._avg.attemptEfficiency || 0,
                    avgSolved: sectionKpis._avg.totalSolved || 0,
                    avgConsistency: sectionKpis._avg.consistencyScore || 0
                };
            }));

            res.json({ success: true, data: detailed });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed fetching section data' });
        }
    },

    // 5. GET /api/college/v2/:collegeId/at-risk
    getAtRiskStudents: async (req: Request, res: Response) => {
        try {
            const collegeId = req.params.collegeId as string;
            // Define At-Risk: Low consistency OR low efficiency OR high plagiarism
            const atRisk = await (prisma as any).studentAnalytics.findMany({
                where: {
                    student: { collegeId },
                    OR: [
                        { consistencyScore: { lt: 30 } },
                        { attemptEfficiency: { lt: 20 } },
                        { integrityScore: { lt: 70 } }
                    ]
                },
                include: { student: true },
                take: 50
            });
            res.json({ success: true, data: atRisk });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed fetching at-risk pool' });
        }
    }
};
