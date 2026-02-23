import { Request, Response } from 'express';
import { collegeInvitationService } from './collegeInvitation.service';
import { AppError } from '../../middleware/error';

export const collegeInvitationController = {
    /**
     * @route POST /api/admin/college/:collegeId/invite-students
     * @desc Admins bulk invite students to a college via email
     */
    async inviteStudents(req: Request, res: Response) {
        try {
            const collegeId = req.params.collegeId as string;
            const { emails } = req.body;

            if (!collegeId) {
                throw new AppError('College ID is required', 400);
            }

            if (!emails || !Array.isArray(emails) || emails.length === 0) {
                throw new AppError('A valid array of emails is required', 400);
            }

            const results = await collegeInvitationService.inviteStudents(collegeId, emails);

            res.status(200).json({
                success: true,
                message: 'Bulk invitation process completed',
                data: results
            });
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(`Failed to process invitations: ${error.message}`, 500);
        }
    },

    /**
     * @route GET /api/admin/college/:collegeId/invitations
     * @desc Get a status list of all invitations for a college
     */
    async getInvitations(req: Request, res: Response) {
        try {
            const collegeId = req.params.collegeId as string;

            if (!collegeId) {
                throw new AppError('College ID is required', 400);
            }

            const invitations = await collegeInvitationService.getInvitations(collegeId);

            res.status(200).json({
                success: true,
                data: invitations
            });
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(`Failed to fetch invitations: ${error.message}`, 500);
        }
    },

    /**
     * @route POST /api/college/invitation/opt-out
     * @desc Public unauthenticated route for student opt-out link in email
     */
    async optOut(req: Request, res: Response) {
        try {
            const { token } = req.body;

            if (!token) {
                throw new AppError('Opt-out token is required', 400);
            }

            const response = await collegeInvitationService.optOut(token);

            res.status(200).json({
                success: true,
                message: response.message
            });
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(`Failed to opt out: ${error.message}`, 500);
        }
    }
};
