import prisma from '../config/database';
import { EmailService } from './email.service';
import { GroqService } from './groq.service';
import { config } from '../config';

export class ReportService {
    /**
     * Generate Daily Reports for a Program (Beginner, Intermediate, Expert)
     */
    static async generateDailyReports(programId: string) {
        const program = await prisma.program.findUnique({
            where: { id: programId },
        });

        if (!program) throw new Error('Program not found');

        const sections = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const section of sections) {
            // Fetch assignments for this section for today
            // We join ProgramStudent to filter by section
            // But DailyAssignment doesn't store section directly. We joined User, but User.section might change.
            // Requirement: "For each student: Select a random problem from the assigned pool based on section".
            // The assignment was created based on the user's section at that time.
            // We can fetch assignments where user.section (in ProgramStudent) == section.

            // Better: Fetch ProgramStudents by section, then get their today's assignment.
            const students = await prisma.programStudent.findMany({
                where: { programId, section },
                include: { user: true }
            });

            const studentIds = students.map(s => s.userId);

            const assignments = await prisma.dailyAssignment.findMany({
                where: {
                    programId,
                    userId: { in: studentIds },
                    assignedAt: { gte: today }
                },
                include: {
                    user: true,
                    problem: true,
                    submission: true
                }
            });

            if (assignments.length === 0) continue;

            // Generate CSV Data
            const header = [
                'Student Name',
                'Email',
                'Problem Assigned',
                'Status',
                'Submission Time',
                'Code Quality',
                'Approach Quality',
                'Optimization Feedback',
                'Cheating Flag'
            ];

            const rows = [];

            for (const assignment of assignments) {
                let codeQuality = 'N/A';
                let approachQuality = 'N/A';
                let optFeedback = 'N/A';
                let cheatingFlag = 'false';
                let submissionTime = '';

                if (assignment.status === 'SOLVED' && assignment.submission) {
                    submissionTime = assignment.submission.createdAt.toISOString();

                    // Get AI Eval
                    const evalResult = await GroqService.evaluateSubmission(
                        assignment.problem.description,
                        assignment.submission.code,
                        "Not provided"
                    );

                    codeQuality = evalResult.codeQuality || 'Unknown';
                    approachQuality = evalResult.approachQuality || 'Unknown';
                    optFeedback = evalResult.optimizationFeedback || 'None';
                    cheatingFlag = String(evalResult.cheatingFlag || false);
                }

                rows.push([
                    assignment.user.username,
                    assignment.user.email,
                    assignment.problem.title,
                    assignment.status,
                    submissionTime,
                    codeQuality,
                    approachQuality,
                    `"${optFeedback.replace(/"/g, '""')}"`, // Escape CSV quotes
                    cheatingFlag
                ].join(','));
            }

            const csvContent = [header.join(','), ...rows].join('\n');

            // Email the report
            // In real system, maybe specific admin email or the program admin
            await EmailService.sendEmail(
                config.admin.email,
                `Daily Report - ${program.name} - ${section}`,
                `<p>Attached is the daily report for ${section} section.</p>`,
                [
                    {
                        filename: `Report_${program.name}_${section}_${today.toISOString().split('T')[0]}.csv`,
                        content: csvContent
                    }
                ]
            );
        }

        return { success: true };
    }
}
