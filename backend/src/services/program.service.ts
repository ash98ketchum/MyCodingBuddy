import prisma from '../config/database';
import { Prisma } from '@prisma/client';

export class ProgramService {
    /**
     * Create a new training program
     */
    static async createProgram(data: { name: string; adminId: string; startDate: Date; endDate?: Date }) {
        return prisma.program.create({
            data: {
                name: data.name,
                adminId: data.adminId,
                startDate: data.startDate,
                endDate: data.endDate,
                isActive: true, // Default to active
            },
        });
    }

    /**
     * List all programs (for admin dashboard)
     */
    static async getAllPrograms() {
        return prisma.program.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { students: true, problemPool: true, assignments: true }
                }
            }
        });
    }

    /**
     * Get Program Details
     */
    static async getProgramById(programId: string) {
        return prisma.program.findUnique({
            where: { id: programId },
            include: {
                students: {
                    include: { user: true }
                },
                problemPool: {
                    include: { problem: true }
                },
                assignments: {
                    take: 10,
                    orderBy: { assignedAt: 'desc' },
                    include: { user: true, problem: true, submission: true }
                }
            }
        });
    }

    /**
     * Import students from CSV content
     * CSV Format: email,section
     */
    static async importStudents(programId: string, csvContent: string) {
        const lines = csvContent.split(/\r?\n/);
        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[]
        };

        // Skip header if present (heuristic: check if first line has 'email')
        let startIndex = 0;
        if (lines[0] && lines[0].toLowerCase().includes('email')) {
            startIndex = 1;
        }

        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const [email, sectionRaw] = line.split(',').map(s => s.trim());

            if (!email) {
                results.failed++;
                results.errors.push(`Line ${i + 1}: Missing email`);
                continue;
            }

            // Validate Section
            const section = sectionRaw ? sectionRaw.toUpperCase() : 'BEGINNER';
            if (!['BEGINNER', 'INTERMEDIATE', 'EXPERT'].includes(section)) {
                results.failed++;
                results.errors.push(`Line ${i + 1}: Invalid section '${sectionRaw}' for ${email}`);
                continue;
            }

            try {
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) {
                    results.failed++;
                    results.errors.push(`Line ${i + 1}: User not found for email ${email}`);
                    continue;
                }

                // Create or Update ProgramStudent
                await prisma.programStudent.upsert({
                    where: {
                        programId_userId: {
                            programId,
                            userId: user.id
                        }
                    },
                    update: { section },
                    create: {
                        programId,
                        userId: user.id,
                        section
                    }
                });

                results.success++;
            } catch (error: any) {
                results.failed++;
                results.errors.push(`Line ${i + 1}: Error processing ${email} - ${error.message}`);
            }
        }

        return results;
    }

    /**
     * Add problems to the program pool
     */
    static async addProblemsToPool(programId: string, problemIds: string[], difficultyTag: string) {
        if (!['BEGINNER', 'INTERMEDIATE', 'EXPERT'].includes(difficultyTag)) {
            throw new Error("Invalid difficulty tag");
        }

        const count = await prisma.programProblemPool.createMany({
            data: problemIds.map(pid => ({
                programId,
                problemId: pid,
                difficultyTag
            })),
            skipDuplicates: true
        });

        return { added: count.count };
    }
}
