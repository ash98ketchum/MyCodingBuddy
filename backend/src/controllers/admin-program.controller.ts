import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error';
import { EmailService } from '../services/email.service';
import crypto from 'crypto';

// ... (other imports stay same, we just prepend EmailService)
const prisma = new PrismaClient();

// --- Simple Bloom Filter Implementation ---
// Size: 2^15 bits = 32,768 bits = 4096 bytes.
// Hash functions: 3
const BIT_SIZE = 32768;
const HASH_COUNT = 3;

function fnv1a(str: string): number {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0;
}

function getHashIndices(str: string): number[] {
    const indices: number[] = [];
    for (let i = 0; i < HASH_COUNT; i++) {
        const hash = fnv1a(`${str}_${i}`);
        indices.push(hash % BIT_SIZE);
    }
    return indices;
}

export const adminProgramController = {
    /**
     * @route GET /api/admin/program/bloom
     * @desc Generates and returns a compressed Bloom filter (hex string) of all ProgramStudent emails.
     *       The frontend will replicate the exact hashing logic to check for probable existence.
     */
    getBloomFilter: async (req: Request, res: Response) => {
        try {
            // Get all emails
            const students = await prisma.programStudent.findMany({
                select: { email: true }
            });

            // Initialize bit array (Uint8Array, each element is 8 bits)
            const byteSize = Math.ceil(BIT_SIZE / 8);
            const buffer = new Uint8Array(byteSize);

            // Populate Bloom Filter
            students.forEach(s => {
                const email = s.email.toLowerCase().trim();
                const indices = getHashIndices(email);
                indices.forEach(idx => {
                    const byteIndex = Math.floor(idx / 8);
                    const bitPosition = idx % 8;
                    buffer[byteIndex] |= (1 << bitPosition); // Set the bit
                });
            });

            // Convert to Hex string for easy JSON transport
            const hexFilter = Buffer.from(buffer).toString('hex');

            res.json({
                success: true,
                data: {
                    filter: hexFilter,
                    bitSize: BIT_SIZE,
                    hashCount: HASH_COUNT
                }
            });
        } catch (error) {
            throw new AppError('Failed to generate bloom filter', 500);
        }
    },

    /**
     * @route GET /api/admin/program/list
     * @desc Get list of unique programs derived from ProgramStudent.
     */
    getPrograms: async (req: Request, res: Response) => {
        try {
            // Because the legacy Program model is gone, we aggregate existing Programs 
            // from the programId string field on the ProgramStudent table.

            const uniquePrograms = await prisma.programStudent.groupBy({
                by: ['programId'],
                _count: {
                    id: true // Count number of students in the program
                }
            });

            // For each program, count total assignments
            const programsWithStats = await Promise.all(
                uniquePrograms.map(async (prog) => {
                    const assignmentCount = await prisma.dailyAssignment.count({
                        where: { programId: prog.programId }
                    });

                    return {
                        id: prog.programId,
                        name: prog.programId.replace(/_/g, ' '),
                        startDate: new Date('2026-02-01T00:00:00Z').toISOString(), // Placeholder since we don't have program start dates in DB anymore
                        isActive: true,
                        _count: {
                            students: prog._count.id,
                            assignments: assignmentCount
                        }
                    };
                })
            );

            // If no programs exist yet, return a default mock so UI isn't empty
            if (programsWithStats.length === 0) {
                programsWithStats.push({
                    id: 'COLLEGE_2026',
                    name: 'COLLEGE 2026',
                    startDate: new Date('2026-02-01T00:00:00Z').toISOString(),
                    isActive: true,
                    _count: {
                        students: 0,
                        assignments: 0
                    }
                });
            }

            res.json(programsWithStats); // Return shape directly to match the frontend expectations: res.data
        } catch (error) {
            throw new AppError('Failed to fetch programs', 500);
        }
    },

    /**
     * @route POST /api/admin/program/create
     * @desc Simulated endpoint to create a program group (data group) in Phase 2
     */
    createProgram: async (req: Request, res: Response) => {
        try {
            const { name, startDate } = req.body;

            if (!name) {
                throw new AppError('Program name / ID is required', 400);
            }

            // In Phase 2, we don't strictly INSERT a Program row.
            // We just return success so the frontend UI can optimistically update or display a success message.
            res.json({
                success: true,
                message: 'Program group successfully initialized',
                data: {
                    id: name.toUpperCase().replace(/\s+/g, '_'),
                    name,
                    startDate: startDate || new Date().toISOString(),
                    isActive: true
                }
            });
        } catch (error) {
            throw new AppError('Failed to initialize program group', 500);
        }
    },

    /**
     * @route GET /api/admin/program/students/verify
     * @desc Exact DB lookup for a student when Bloom filter says "probably exists"
     */
    verifyStudent: async (req: Request, res: Response) => {
        try {
            const { email } = req.query;
            if (!email || typeof email !== 'string') {
                throw new AppError('Email is required', 400);
            }

            const student = await prisma.programStudent.findUnique({
                where: { email: email.toLowerCase().trim() }
            });

            res.json({
                success: true,
                data: student // Null if not found
            });
        } catch (error) {
            throw new AppError('Failed to verify student', 500);
        }
    },

    /**
     * @route GET /api/admin/program/problems
     * @desc Retrieves problems for the assignment dropdown
     */
    getProblems: async (req: Request, res: Response) => {
        try {
            const problems = await prisma.problem.findMany({
                select: {
                    id: true,
                    title: true,
                    difficulty: true,
                    rating: true,
                    tags: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            res.json({
                success: true,
                data: problems
            });
        } catch (error) {
            throw new AppError('Failed to retrieve problems', 500);
        }
    },

    /**
     * @route POST /api/admin/program/assign
     * @desc Assigns a specific problem to a student by creating a DailyAssignment
     */
    assignProblem: async (req: Request, res: Response) => {
        try {
            const { studentId, problemId } = req.body;

            if (!studentId || !problemId) {
                throw new AppError('Student ID and Problem ID are required', 400);
            }

            // Check if student exists
            const student = await prisma.programStudent.findUnique({
                where: { id: studentId }
            });
            if (!student) throw new AppError('Student not found', 404);

            // Check if problem exists
            const problem = await prisma.problem.findUnique({
                where: { id: problemId }
            });
            if (!problem) throw new AppError('Problem not found', 404);

            // Check for duplicate assignment
            const existing = await prisma.dailyAssignment.findFirst({
                where: {
                    studentId,
                    problemId,
                    date: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lt: new Date(new Date().setHours(23, 59, 59, 999))
                    }
                }
            });

            if (existing) {
                throw new AppError('This problem was already assigned to the student today', 400);
            }

            // Create assignment
            const assignment = await prisma.dailyAssignment.create({
                data: {
                    studentId,
                    problemId,
                    programId: student.programId,
                    status: 'PENDING'
                }
            });

            // Asynchronously dispatch email to not block the frontend request
            (async () => {
                try {
                    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    const subject = `Your Daily Coding Challenge: ${problem.title}`;
                    const html = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 30px; text-align: center; }
                        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
                        .content { padding: 30px; color: #333333; line-height: 1.6; }
                        .problem-card { background-color: #f8f9fa; border-left: 5px solid #764ba2; padding: 20px; margin: 20px 0; border-radius: 4px; }
                        .problem-title { font-size: 20px; font-weight: bold; color: #2d3748; margin-bottom: 10px; }
                        .problem-meta { font-size: 14px; color: #718096; margin-bottom: 15px; }
                        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; color: white; }
                        .badge-easy { background-color: #48bb78; }
                        .badge-medium { background-color: #ecc94b; color: #744210; }
                        .badge-hard { background-color: #f56565; }
                        .btn { display: inline-block; background-color: #764ba2; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; text-align: center; margin-top: 20px; transition: background-color 0.3s; }
                        .btn:hover { background-color: #5a3780; }
                        .footer { background-color: #edf2f7; padding: 20px; text-align: center; font-size: 12px; color: #718096; }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <div class="header">
                          <h1>MyCodingBuddy College Program</h1>
                        </div>
                        <div class="content">
                          <p>Hello ${student.name},</p>
                          <p>Here is your daily coding assignment selected just for you.</p>
                          
                          <div class="problem-card">
                            <div class="problem-title">${problem.title}</div>
                            <div class="problem-meta">
                              <span class="badge badge-${problem.difficulty.toLowerCase()}">${problem.difficulty}</span>
                              <span> &bull; Assigned: ${date}</span>
                            </div>
                            <p>${problem.description.substring(0, 150)}...</p>
                          </div>
                
                          <div style="text-align: center;">
                            <a href="http://localhost:5173/problems/${problem.slug}" class="btn">Solve Problem</a>
                          </div>
                        </div>
                        <div class="footer">
                          &copy; ${new Date().getFullYear()} MyCodingBuddy. All rights reserved.<br>
                          Keep coding, keep growing!
                        </div>
                      </div>
                    </body>
                    </html>
                    `;

                    const success = await EmailService.sendEmail(student.email, subject, html);
                    if (success) {
                        await prisma.dailyAssignment.update({
                            where: { id: assignment.id },
                            data: { status: 'SENT' }
                        });
                        console.log(`✅ Instantly dispatched email to ${student.email}`);
                    }
                } catch (err) {
                    console.error('⚠️ Async email dispatch failed:', err);
                }
            })();

            res.json({
                success: true,
                message: 'Problem assigned successfully',
                data: assignment
            });
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to assign problem: ' + error.message, 500);
        }
    }
};
