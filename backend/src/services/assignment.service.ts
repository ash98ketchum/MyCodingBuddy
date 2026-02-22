import prisma from '../config/database';
import { EmailService } from './email.service';
import { config } from '../config';

export class AssignmentService {
    /**
     * Run the daily assignment logic for a specific program
     * Can be triggered by CRON or Manually
     */
    static async runDailyAssignment(programId: string) {
        const program = await prisma.program.findUnique({
            where: { id: programId },
            include: {
                students: { include: { user: true } },
                problemPool: true
            }
        });

        if (!program || !program.isActive) {
            throw new Error('Program not found or inactive');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let assignedCount = 0;
        const errors: string[] = [];

        // Process each student
        for (const pStudent of program.students) {
            try {
                const { userId, section, user } = pStudent;

                // 1. Check if already assigned today
                const existingAssignment = await prisma.dailyAssignment.findFirst({
                    where: {
                        userId,
                        programId,
                        assignedAt: { gte: today }
                    }
                });

                if (existingAssignment) {
                    // Already assigned today
                    continue;
                }

                // 2. Get eligible problems (in pool, matching section, not yet assigned to user)
                // Note: We check *all* past assignments to avoid repetition
                const pastAssignments = await prisma.dailyAssignment.findMany({
                    where: { userId },
                    select: { problemId: true }
                });
                const pastProblemIds = new Set(pastAssignments.map(a => a.problemId));

                // Filter pool by difficulty
                const eligiblePool = program.problemPool.filter(p => p.difficultyTag === section);

                // Filter out already solved/assigned
                const availableProblems = eligiblePool.filter(p => !pastProblemIds.has(p.problemId));

                if (availableProblems.length === 0) {
                    errors.push(`No available problems for user ${user.email} in section ${section}`);
                    continue;
                }

                // 3. Pick Random Problem
                const randomIndex = Math.floor(Math.random() * availableProblems.length);
                const selectedProblemId = availableProblems[randomIndex].problemId;

                // 4. Assign
                await prisma.dailyAssignment.create({
                    data: {
                        userId,
                        problemId: selectedProblemId,
                        programId,
                        status: 'ASSIGNED',
                        assignedAt: new Date(),
                        isSolved: false
                    }
                });

                // 5. Email Student
                // In a real app, fetch problem details to include in email
                const problem = await prisma.problem.findUnique({ where: { id: selectedProblemId } });
                const problemUrl = `${config.clientUrl}/problem/${problem?.slug}`; // Assuming clientUrl exists in config or use env

                await EmailService.sendEmail(
                    user.email,
                    `Your Daily Coding Assignment - ${program.name}`,
                    `
            <h1>Daily Challenge</h1>
            <p>Hi ${user.username || 'Student'},</p>
            <p>Your problem for today is ready!</p>
            <p><strong>Problem:</strong> ${problem?.title}</p>
            <p><strong>Difficulty:</strong> ${section}</p>
            <p><a href="${problemUrl}">Solve Now</a></p>
            <p>Good luck!</p>
            `
                );

                assignedCount++;

            } catch (err: any) {
                errors.push(`Error assigning to student ${pStudent.userId}: ${err.message}`);
            }
        }

        return {
            totalStudents: program.students.length,
            assigned: assignedCount,
            errors
        };
    }

    /**
     * Mark assignment as solved (Called by Worker)
     */
    static async markAsSolved(userId: string, problemId: string, submissionId: string) {
        // Find the pending assignment for this problem
        // We look for the most recent one or specific one
        const assignment = await prisma.dailyAssignment.findFirst({
            where: {
                userId,
                problemId,
                status: 'ASSIGNED'
            },
            orderBy: { assignedAt: 'desc' }
        });

        if (assignment) {
            await prisma.dailyAssignment.update({
                where: { id: assignment.id },
                data: {
                    status: 'SOLVED',
                    isSolved: true,
                    submissionId
                }
            });
            console.log(`✅ Daily Assignment ${assignment.id} marked as SOLVED`);
        }
    }
}
