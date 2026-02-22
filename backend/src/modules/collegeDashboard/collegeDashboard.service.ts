import { PrismaClient } from '@prisma/client';
import redis from '../../config/redis';

const prisma = new PrismaClient();

export class CollegeDashboardService {

    // Helper: Redis Cache Wrapper
    private static async getCached<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
        return fetcher(); // Bypass redis for now until standard TTL implementations match other modules
        /*
        const cached = await redis.get(key);
        if (cached) return JSON.parse(cached);
        const data = await fetcher();
        await redis.setex(key, ttlSeconds, JSON.stringify(data));
        return data;
        */
    }

    /**
     * 1. Overview Cards Analytics
     */
    static async getOverview(collegeId: string) {
        return this.getCached(`college:overview:${collegeId}`, 300, async () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Total Students
            const totalStudents = await prisma.collegeStudent.count({
                where: { collegeId }
            });

            // Active Today (Students who submitted something today)
            const activeToday = await prisma.collegeSubmissionAnalytics.findMany({
                where: {
                    student: { collegeId },
                    createdAt: { gte: today }
                },
                distinct: ['studentId'],
                select: { studentId: true }
            }).then(res => res.length);

            // Problems Solved Today
            const solvedToday = await prisma.collegeSubmissionAnalytics.count({
                where: {
                    student: { collegeId },
                    createdAt: { gte: today },
                    isAccepted: true
                }
            });

            // Average Solve Rate (Total Accepted / Total Assignments)
            const totalAssignments = await prisma.collegeAssignment.count({
                where: { collegeId }
            });
            const totalAccepted = await prisma.collegeSubmissionAnalytics.count({
                where: { student: { collegeId }, isAccepted: true }
            });
            const avgSolveRate = totalAssignments > 0 ? Math.round((totalAccepted / totalAssignments) * 100) : 0;

            // Integrity Score (Percentage of submissions WITHOUT cheating flags)
            const totalSubmissions = await prisma.collegeSubmissionAnalytics.count({
                where: { student: { collegeId } }
            });
            const suspiciousSubmissions = await prisma.collegeSubmissionAnalytics.count({
                where: { student: { collegeId }, cheatingFlag: true }
            });
            const integrityScore = totalSubmissions > 0
                ? Math.round(((totalSubmissions - suspiciousSubmissions) / totalSubmissions) * 100)
                : 100;

            // Avg AI Code Quality
            const qualityRows = await prisma.collegeSubmissionAnalytics.findMany({
                where: { student: { collegeId }, codeQuality: { not: null } },
                select: { codeQuality: true }
            });

            // Map subjective scores to numbers for averaging
            const qMap: any = { 'Excellent': 5, 'Good': 4, 'Fair': 3, 'Poor': 2, 'Bad': 1 };
            let qSum = 0;
            let qCount = 0;
            qualityRows.forEach(r => {
                if (r.codeQuality && qMap[r.codeQuality]) {
                    qSum += qMap[r.codeQuality];
                    qCount++;
                }
            });
            const avgCodeQuality = qCount > 0 ? (qSum / qCount).toFixed(1) + '/5.0' : 'N/A';

            return {
                totalStudents,
                activeToday,
                solvedToday,
                avgSolveRate,
                integrityScore,
                avgCodeQuality
            };
        });
    }

    /**
     * 2. Performance Analytics
     */
    static async getPerformanceAnalytics(collegeId: string) {
        return this.getCached(`college:performance:${collegeId}`, 3600, async () => {
            // Last 7 days chart data
            const last7Days = [...Array(7)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                d.setHours(0, 0, 0, 0);
                return d;
            });

            const solveRateData = await Promise.all(last7Days.map(async (date) => {
                const nextDay = new Date(date);
                nextDay.setDate(date.getDate() + 1);

                const assigned = await prisma.collegeAssignment.count({
                    where: { collegeId, assignedAt: { gte: date, lt: nextDay } }
                });
                const solved = await prisma.collegeSubmissionAnalytics.count({
                    where: {
                        student: { collegeId },
                        isAccepted: true,
                        createdAt: { gte: date, lt: nextDay }
                    }
                });

                return {
                    date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    assigned,
                    solved
                };
            }));

            // Average execution time & attempts
            const analytics = await prisma.collegeSubmissionAnalytics.aggregate({
                where: { student: { collegeId } },
                _avg: { executionTime: true, attemptCount: true }
            });

            return {
                solveRateData,
                avgExecutionTime: Math.round(analytics._avg.executionTime || 0),
                avgAttempts: Number((analytics._avg.attemptCount || 0).toFixed(1))
            };
        });
    }

    /**
     * 3. Student Segmentation
     */
    static async getStudentSegmentation(collegeId: string) {
        // Find students grouped by activity and success
        const students = await prisma.collegeStudent.findMany({
            where: { collegeId },
            include: {
                analytics: true,
                assignments: true
            }
        });

        let topPerformers = 0;
        let consistent = 0;
        let atRisk = 0;
        let inactive = 0;

        students.forEach(s => {
            if (s.assignments.length === 0) {
                inactive++;
                return;
            }

            const solvedCount = s.analytics.filter(a => a.isAccepted).length;
            const solveRate = solvedCount / s.assignments.length;

            if (solveRate >= 0.9) topPerformers++;
            else if (solveRate >= 0.5) consistent++;
            else if (solveRate > 0) atRisk++;
            else inactive++;
        });

        return {
            segments: [
                { name: 'Top Performers', value: topPerformers, color: '#10B981' },
                { name: 'Consistent Solvers', value: consistent, color: '#3B82F6' },
                { name: 'At Risk', value: atRisk, color: '#F59E0B' },
                { name: 'Inactive', value: inactive, color: '#EF4444' }
            ]
        };
    }

    /**
     * 4. Integrity Analytics
     */
    static async getIntegrityAnalytics(collegeId: string) {
        const total = await prisma.collegeSubmissionAnalytics.count({
            where: { student: { collegeId } }
        });

        const flagged = await prisma.collegeSubmissionAnalytics.count({
            where: { student: { collegeId }, cheatingFlag: true }
        });

        const pasteFlags = await prisma.collegeSubmissionAnalytics.count({
            where: { student: { collegeId }, pastedCode: true }
        });

        const tabFlags = await prisma.collegeSubmissionAnalytics.count({
            where: { student: { collegeId }, tabSwitches: { gt: 3 } }
        });

        return {
            honestRatio: total > 0 ? Math.round(((total - flagged) / total) * 100) : 100,
            suspiciousRatio: total > 0 ? Math.round((flagged / total) * 100) : 0,
            totalFlagged: flagged,
            flagsByType: [
                { type: 'AI Similar', count: flagged },
                { type: 'Direct Paste', count: pasteFlags },
                { type: 'Tab Switches', count: tabFlags }
            ]
        };
    }

    /**
     * 5. Problem Analytics
     */
    static async getProblemAnalytics(collegeId: string) {
        // We aggregate submission analytics by ProblemId for this college
        // For simplicity using raw logic mapping
        const analytics = await prisma.collegeSubmissionAnalytics.findMany({
            where: { student: { collegeId } },
            include: {
                student: true
            }
        });

        // Normally we'd join with Problem table, but since problemId is stored, we will group them
        const problemMap: any = {};

        analytics.forEach(a => {
            if (!problemMap[a.problemId]) {
                problemMap[a.problemId] = { attempts: 0, solves: 0, problemId: a.problemId };
            }
            problemMap[a.problemId].attempts++;
            if (a.isAccepted) problemMap[a.problemId].solves++;
        });

        const problems = Object.values(problemMap).map((p: any) => ({
            ...p,
            solveRate: p.attempts > 0 ? Math.round((p.solves / p.attempts) * 100) : 0
        }));

        problems.sort((a, b) => b.solves - a.solves);

        // Grab top 5 most solved, and top 5 least solved
        return {
            mostSolved: problems.slice(0, 5),
            leastSolved: [...problems].sort((a, b) => a.solveRate - b.solveRate).slice(0, 5)
        };
    }

    /**
     * 6. College Leaderboard
     */
    static async getLeaderboard(collegeId: string) {
        const students = await prisma.collegeStudent.findMany({
            where: { collegeId },
            include: {
                analytics: {
                    where: { isAccepted: true }
                }
            }
        });

        const leaderboard = students.map(s => {
            return {
                studentId: s.id,
                name: s.name,
                email: s.email,
                problemsSolved: s.analytics.length,
                score: s.analytics.length * 10 // Mock 10 points per solve
            };
        }).sort((a, b) => b.score - a.score).slice(0, 50); // Top 50

        return leaderboard;
    }
}
