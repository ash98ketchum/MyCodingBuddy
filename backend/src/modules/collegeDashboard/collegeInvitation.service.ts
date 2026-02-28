import { PrismaClient, InvitationStatus } from '@prisma/client';
import crypto from 'crypto';
import { EmailService } from '../../services/email.service';
import { AppError } from '../../middleware/error';
import { config } from '../../config';

const prisma = new PrismaClient();

export const collegeInvitationService = {
    /**
     * Bulk invite students by email
     */
    async inviteStudents(collegeId: string, emails: string[]) {
        // 1. Validate College exists (create mock if it doesn't to support frontend "Program Groups")
        const college = await prisma.college.upsert({
            where: { id: collegeId },
            update: {},
            create: {
                id: collegeId,
                name: collegeId.replace(/_/g, ' '),
                isActive: true
            }
        });

        // Filter duplicates and normalize
        const uniqueEmails = [...new Set(emails.map(e => e.toLowerCase().trim()))];

        const results = {
            invited: 0,
            alreadyEnrolled: 0,
            errors: [] as string[],
        };

        // 2. Query existing mappings in CollegeStudent
        const existingStudents = await prisma.collegeStudent.findMany({
            where: {
                collegeId,
                email: { in: uniqueEmails },
            },
            select: { email: true }
        });
        const enrolledEmails = new Set(existingStudents.map(s => s.email));

        // 3. Process each email
        for (const email of uniqueEmails) {
            try {
                if (enrolledEmails.has(email)) {
                    results.alreadyEnrolled++;
                    continue;
                }

                // Check for existing pending invitation
                const existingInvite = await prisma.collegeInvitation.findFirst({
                    where: { collegeId, email, status: 'PENDING' }
                });

                let token = existingInvite?.token;

                if (!existingInvite) {
                    token = crypto.randomBytes(32).toString('hex');
                    // Expiry: 7 days from now
                    const expiresAt = new Date();
                    expiresAt.setDate(expiresAt.getDate() + 7);

                    await prisma.collegeInvitation.create({
                        data: {
                            collegeId,
                            email,
                            token,
                            expiresAt,
                        }
                    });
                } else if (existingInvite.expiresAt < new Date()) {
                    // Refresh expiration if it expired but they requested a re-invite
                    const expiresAt = new Date();
                    expiresAt.setDate(expiresAt.getDate() + 7);
                    token = existingInvite.token;
                    await prisma.collegeInvitation.update({
                        where: { id: existingInvite.id },
                        data: { status: 'PENDING', expiresAt }
                    });
                }

                // Send Email using automated email workflow
                // Check if global user exists to map name
                const platformUser = await prisma.user.findUnique({ where: { email } });
                const name = platformUser?.fullName || platformUser?.username || 'Student';

                // ==========================================
                // AUTO-ENROLLMENT (No Action Needed Flow)
                // ==========================================

                // 1. Create/Update CollegeStudent so they appear immediately in Top Performers and College Dashboard
                await prisma.collegeStudent.upsert({
                    where: { email },
                    update: { collegeId },
                    create: {
                        collegeId,
                        email,
                        name
                    }
                });

                // 2. Create/Update ProgramStudent so they appear in Assignment lists and can receive automated problem emails
                // Note: The UI maps collegeId to programId for assignment screens
                await prisma.programStudent.upsert({
                    where: { email },
                    update: { programId: collegeId },
                    create: {
                        programId: collegeId,
                        email,
                        name
                    }
                });

                // Safely determine frontend origin
                const frontendUrl = (Array.isArray(config.cors.origin) && config.cors.origin.length > 0)
                    ? config.cors.origin[0]
                    : (typeof config.cors.origin === 'string' ? config.cors.origin : 'http://localhost:5173');

                const optOutUrl = `${frontendUrl}/opt-out/${token}`;

                const subject = `You have been invited to join ${college.name} program`;
                const html = `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial; padding: 20px;">
            <h2>Welcome to ${college.name} Registration!</h2>
            <p>Hello ${name},</p>
            <p>You have been registered for the ${college.name} coding program.</p>
            
            <p><strong>If you want to participate:</strong> No action is needed! Start solving problems.</p>
            <br />
            <p style="font-size: 12px; color: #666;">
              <strong>If you want to opt out:</strong> Please click the secure link below to remove yourself from this college program instantly.
            </p>
            <a href="${optOutUrl}" style="padding: 10px 15px; background: #e53e3e; color: white; text-decoration: none; border-radius: 5px;">Opt Out of Program</a>
          </body>
          </html>
        `;

                // Mock email functionality for robust scale without spamming in dev
                try {
                    await EmailService.sendEmail(email, subject, html);
                    results.invited++;
                } catch (e: any) {
                    results.errors.push(`Failed sending email to ${email}: ${e.message}`);
                }

            } catch (err: any) {
                results.errors.push(`Failed to invite ${email}: ${err.message}`);
            }
        }

        return results;
    },

    /**
     * Get all invitations for a given college
     */
    async getInvitations(collegeId: string) {
        return prisma.collegeInvitation.findMany({
            where: { collegeId },
            orderBy: { createdAt: 'desc' }
        });
    },

    /**
     * Handle Opt-Out Process securely using token
     */
    async optOut(token: string) {
        const invitation = await prisma.collegeInvitation.findUnique({
            where: { token }
        });

        if (!invitation) {
            throw new AppError('Invalid or expired opt-out token', 400);
        }

        if (invitation.status === 'DECLINED') {
            return { message: 'You have already opted out.' };
        }

        // Mark invitation as declined
        await prisma.collegeInvitation.update({
            where: { id: invitation.id },
            data: { status: 'DECLINED' }
        });

        // If they were already mapped in CollegeStudent, remove them
        // (This ensures one-click opt-out is complete)
        await prisma.collegeStudent.deleteMany({
            where: {
                collegeId: invitation.collegeId,
                email: invitation.email
            }
        });

        return { message: 'You have successfully opted out of the program.' };
    }
};
