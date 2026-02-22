import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

export class StudentKPIService {
    /**
     * Aggregates all submissions for a given student and updates their StudentAnalytics row.
     * This is a "heavy" write operation but makes Dashboard queries instant.
     */
    static async updateStudentAnalytics(studentId: string) {
        const student: any = await prisma.collegeStudent.findUnique({
            where: { id: studentId },
            include: { analytics: true, assignments: true }
        });

        if (!student) throw new Error('Student not found');

        const analytics = student.analytics;
        const totalAttempts = analytics.length;
        const accepted = analytics.filter((a: any) => a.isAccepted);
        const totalSolved = accepted.length;

        // 1. Attempt Efficiency
        const attemptEfficiency = totalAttempts > 0 ? (totalSolved / totalAttempts) * 100 : 0;

        // 2. Average Solve Time (Only counting accepted solutions)
        const validTimes = accepted.filter((a: any) => a.executionTime !== null).map((a: any) => a.executionTime!);
        const avgSolveTime = validTimes.length > 0
            ? validTimes.reduce((a: any, b: any) => a + b, 0) / validTimes.length
            : 0;

        // 3. Difficulty Score (Mocking weights for now, ideally fetched from Problem model)
        // Easy: 1x, Medium: 2x, Hard: 3x (For simplicity in this module, assuming 1x base if problem lookup bypassed)
        const difficultyScore = totalSolved * 10;

        // 4. Integrity Score
        const plagiarismCount = analytics.filter((a: any) => a.cheatingFlag || a.pastedCode).length;
        const baseIntegrity = 100;
        const integrityPenalty = plagiarismCount * 15; // 15 points off per flag
        const integrityScore = Math.max(0, baseIntegrity - integrityPenalty);

        // 5. Consistency Score (Activity over last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const uniqueActiveDays = new Set(
            analytics
                .filter((a: any) => new Date(a.createdAt) >= thirtyDaysAgo)
                .map((a: any) => new Date(a.createdAt).toISOString().split('T')[0])
        ).size;

        const consistencyScore = (uniqueActiveDays / 30) * 100;

        const lastActiveAt = analytics.length > 0
            ? new Date(analytics.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt)
            : new Date(student.joinedAt);

        // Save pre-aggregated results into StudentAnalytics
        const updatedAnalytics = await (prisma as any).studentAnalytics.upsert({
            where: { studentId },
            create: {
                studentId,
                totalSolved,
                totalAttempts,
                avgSolveTime,
                difficultyScore,
                consistencyScore,
                attemptEfficiency,
                plagiarismCount,
                integrityScore,
                lastActiveAt
            },
            update: {
                totalSolved,
                totalAttempts,
                avgSolveTime,
                difficultyScore,
                consistencyScore,
                attemptEfficiency,
                plagiarismCount,
                integrityScore,
                lastActiveAt
            }
        });

        return updatedAnalytics;
    }
}
