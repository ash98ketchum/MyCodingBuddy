import { PrismaClient } from '@prisma/client';
import Groq from 'groq-sdk';

const prisma = new PrismaClient();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export class AIReportService {
    static async generateStudentReport(studentId: string) {
        // 1. Fetch pre-aggregated student data to avoid overloading LLM tokens
        const student: any = await prisma.collegeStudent.findUnique({
            where: { id: studentId },
            include: {
                studentAnalytics: true,
                aiReport: true
            }
        });

        if (!student || !student.studentAnalytics) {
            throw new Error('Student or Pre-Aggregated Analytics not found');
        }

        const stats = student.studentAnalytics;

        // 2. Prepare the prompt focusing entirely on the placement performance context
        const prompt = `
            Act as a Senior Placement Coordinator and Technical Evaluator.
            Analyze the following student's competitive programming analytics and generate an objective performance review in strict JSON format.

            Student Name: ${student.name}
            - Total Problems Solved: ${stats.totalSolved}
            - Total Attempts: ${stats.totalAttempts}
            - Attempt Efficiency (AC rate): ${stats.attemptEfficiency.toFixed(1)}%
            - Average Solve Time: ${stats.avgSolveTime}ms
            - Difficulty Score Map: ${stats.difficultyScore}
            - Consistency Rating (Active Days): ${stats.consistencyScore.toFixed(1)}%
            - Plagiarism Flags Detected: ${stats.plagiarismCount}
            - Overall Integrity Score: ${stats.integrityScore} / 100

            Produce a JSON object ONLY with these exact keys:
            {
                "summary": "1 brief paragraph summarizing their placement readiness",
                "strengths": ["string", "string", "string"],
                "weaknesses": ["string", "string"],
                "improvementPlan": "1 specific actionable paragraph",
                "recommendedDiff": "EASY, MEDIUM, or HARD",
                "integrityContext": "1 sentence evaluating their code integrity based on flags"
            }
        `;

        try {
            // 3. Call Groq
            const completion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama3-8b-8192',
                temperature: 0.2, // Low temp for analytical consistency
                response_format: { type: 'json_object' }
            });

            const content = completion.choices[0]?.message?.content;
            if (!content) throw new Error("No completion received from Groq");

            const reportData = JSON.parse(content);

            // 4. Save to DB
            const savedReport = await prisma.aIStudentReport.upsert({
                where: { studentId },
                create: {
                    studentId,
                    summary: reportData.summary,
                    strengths: reportData.strengths,
                    weaknesses: reportData.weaknesses,
                    improvementPlan: reportData.improvementPlan,
                    recommendedDiff: reportData.recommendedDiff,
                    integrityContext: reportData.integrityContext
                },
                update: {
                    summary: reportData.summary,
                    strengths: reportData.strengths,
                    weaknesses: reportData.weaknesses,
                    improvementPlan: reportData.improvementPlan,
                    recommendedDiff: reportData.recommendedDiff,
                    integrityContext: reportData.integrityContext,
                    generatedAt: new Date()
                }
            });

            return savedReport;
        } catch (error) {
            console.error('Groq Generation Failed:', error);
            throw error;
        }
    }
}
