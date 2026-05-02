// backend/src/services/contest.service.ts
import prisma from '../config/database';
import redis from '../config/redis';
import { ContestStatus, ContestType } from '@prisma/client';

const LEADERBOARD_CACHE_TTL = 10; // seconds

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

// ─── List Contests ────────────────────────────────────────────────────────────

export async function listContests(filters: {
    status?: ContestStatus;
    type?: ContestType;
    page?: number;
    limit?: number;
}) {
    const { status, type, page = 1, limit = 12 } = filters;
    const where: any = {};
    if (status) where.status = status;
    if (type) where.contestType = type;

    const [contests, total] = await Promise.all([
        prisma.contest.findMany({
            where,
            include: {
                _count: { select: { participants: true, problems: true } },
            },
            orderBy: { startTime: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.contest.count({ where }),
    ]);

    return {
        contests,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
}

// ─── Get Contest Detail ───────────────────────────────────────────────────────

export async function getContestBySlug(slug: string, userId?: string) {
    const contest = await prisma.contest.findUnique({
        where: { slug },
        include: {
            problems: {
                include: { problem: { select: { id: true, title: true, slug: true, difficulty: true, tags: true } } },
                orderBy: { order: 'asc' },
            },
            _count: { select: { participants: true, submissions: true } },
        },
    });

    if (!contest) return null;

    let isRegistered = false;
    let participantInfo = null;
    if (userId) {
        participantInfo = await prisma.contestParticipant.findUnique({
            where: { contestId_userId: { contestId: contest.id, userId } },
        });
        isRegistered = !!participantInfo;
    }

    // Only show problems if contest is ACTIVE or ENDED
    const showProblems = contest.status === 'ACTIVE' || contest.status === 'ENDED';

    return {
        ...contest,
        problems: showProblems ? contest.problems : [],
        isRegistered,
        participantInfo,
    };
}

// ─── Create Contest (Admin) ───────────────────────────────────────────────────

export async function createContest(data: {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    contestType?: ContestType;
    isPublic?: boolean;
    isPremium?: boolean;
    ratingChange?: boolean;
    bannerImage?: string;
    problemIds?: { problemId: string; order: number; points: number }[];
}) {
    const slug = slugify(data.title) + '-' + Date.now().toString(36);
    const contest = await prisma.contest.create({
        data: {
            title: data.title,
            slug,
            description: data.description,
            startTime: data.startTime,
            endTime: data.endTime,
            duration: data.duration,
            contestType: data.contestType || 'CUSTOM',
            status: 'UPCOMING',
            isPublic: data.isPublic ?? true,
            isPremium: data.isPremium ?? false,
            ratingChange: data.ratingChange ?? true,
            bannerImage: data.bannerImage,
            problems: data.problemIds
                ? {
                    create: data.problemIds.map((p) => ({
                        problemId: p.problemId,
                        order: p.order,
                        points: p.points,
                    })),
                }
                : undefined,
        },
        include: {
            problems: { include: { problem: true } },
            _count: { select: { participants: true } },
        },
    });

    return contest;
}

// ─── Update Contest (Admin) ───────────────────────────────────────────────────

export async function updateContest(
    id: string,
    data: {
        title?: string;
        description?: string;
        startTime?: Date;
        endTime?: Date;
        duration?: number;
        status?: ContestStatus;
        bannerImage?: string;
    }
) {
    return prisma.contest.update({ where: { id }, data });
}

// ─── Delete Contest (Admin) ──────────────────────────────────────────────────

export async function deleteContest(id: string) {
    return prisma.contest.delete({ where: { id } });
}

// ─── Register for Contest ─────────────────────────────────────────────────────

export async function registerForContest(contestId: string, userId: string) {
    const contest = await prisma.contest.findUnique({ where: { id: contestId } });
    if (!contest) throw new Error('Contest not found');
    if (contest.status === 'ENDED' || contest.status === 'CANCELLED') {
        throw new Error('Cannot register for a finished or cancelled contest');
    }

    const existing = await prisma.contestParticipant.findUnique({
        where: { contestId_userId: { contestId, userId } },
    });
    if (existing) throw new Error('Already registered');

    return prisma.contestParticipant.create({
        data: { contestId, userId },
    });
}

// ─── Unregister from Contest ──────────────────────────────────────────────────

export async function unregisterFromContest(contestId: string, userId: string) {
    const contest = await prisma.contest.findUnique({ where: { id: contestId } });
    if (!contest) throw new Error('Contest not found');
    if (contest.status === 'ACTIVE') {
        throw new Error('Cannot unregister from an active contest');
    }

    return prisma.contestParticipant.delete({
        where: { contestId_userId: { contestId, userId } },
    });
}

// ─── Get User Status in Contest ───────────────────────────────────────────────

export async function getUserContestStatus(contestId: string, userId: string) {
    const participant = await prisma.contestParticipant.findUnique({
        where: { contestId_userId: { contestId, userId } },
    });
    if (!participant) return { isRegistered: false };

    const submissions = await prisma.submission.findMany({
        where: { contestId, userId },
        include: { problem: { select: { id: true, title: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
    });

    return { isRegistered: true, participant, submissions };
}

// ─── Contest Leaderboard ──────────────────────────────────────────────────────

export async function getContestLeaderboard(contestId: string) {
    const cacheKey = `contest_leaderboard:${contestId}`;

    // Try Redis cache
    try {
        const cached = await redis.get(cacheKey);
        if (cached) return JSON.parse(cached);
    } catch (_) { }

    const participants = await prisma.contestParticipant.findMany({
        where: { contestId },
        include: {
            user: { select: { id: true, username: true, fullName: true, avatar: true, rating: true } },
        },
        orderBy: [{ score: 'desc' }, { penalty: 'asc' }],
    });

    // Get per-problem status for each participant
    const contest = await prisma.contest.findUnique({
        where: { id: contestId },
        include: { problems: { orderBy: { order: 'asc' }, include: { problem: { select: { id: true, title: true } } } } },
    });

    const problemIds = contest?.problems.map((p) => p.problemId) || [];

    const leaderboard = await Promise.all(
        participants.map(async (p, index) => {
            const submissions = await prisma.submission.findMany({
                where: { contestId, userId: p.userId, problemId: { in: problemIds } },
                orderBy: { createdAt: 'desc' },
            });

            const problemStatus: Record<string, { solved: boolean; attempts: number; time?: number }> = {};
            for (const pid of problemIds) {
                const problemSubmissions = submissions.filter((s) => s.problemId === pid);
                const accepted = problemSubmissions.find((s) => s.verdict === 'ACCEPTED');
                problemStatus[pid] = {
                    solved: !!accepted,
                    attempts: problemSubmissions.length,
                    time: accepted ? Math.floor((accepted.createdAt.getTime() - (contest?.startTime.getTime() || 0)) / 60000) : undefined,
                };
            }

            return {
                rank: index + 1,
                user: p.user,
                score: p.score,
                penalty: p.penalty,
                problemsSolved: p.problemsSolved,
                ratingChange: p.ratingChange,
                problemStatus,
            };
        })
    );

    // Cache for 10 seconds
    try {
        await redis.set(cacheKey, JSON.stringify(leaderboard), 'EX', LEADERBOARD_CACHE_TTL);
    } catch (_) { }

    return leaderboard;
}

// ─── Update Participant Score ─────────────────────────────────────────────────

export async function updateParticipantScore(contestId: string, userId: string) {
    const contest = await prisma.contest.findUnique({
        where: { id: contestId },
        include: { problems: true },
    });
    if (!contest) return;

    const problemMap = new Map(contest.problems.map((p) => [p.problemId, p.points]));
    const problemIds = contest.problems.map((p) => p.problemId);

    // Get best submission per problem
    let totalScore = 0;
    let totalPenalty = 0;
    let problemsSolved = 0;

    for (const problemId of problemIds) {
        const submissions = await prisma.submission.findMany({
            where: { contestId, userId, problemId },
            orderBy: { createdAt: 'asc' },
        });

        const accepted = submissions.find((s) => s.verdict === 'ACCEPTED');
        if (accepted) {
            const basePoints = problemMap.get(problemId) || 100;
            const contestDurationMs = contest.endTime.getTime() - contest.startTime.getTime();
            const solveTimeMs = accepted.createdAt.getTime() - contest.startTime.getTime();
            const timeRatio = solveTimeMs / contestDurationMs;

            // Bonus for early solve
            let timeBonus = 0;
            if (timeRatio <= 0.25) timeBonus = Math.floor(basePoints * 0.1);

            // Penalty for wrong attempts before accepted
            const wrongAttempts = submissions.filter(
                (s) => s.createdAt < accepted.createdAt && s.verdict !== 'ACCEPTED' && s.verdict !== 'PENDING' && s.verdict !== 'QUEUED'
            ).length;
            const wrongPenalty = wrongAttempts * 5;

            totalScore += basePoints + timeBonus - wrongPenalty;
            totalPenalty += Math.floor(solveTimeMs / 60000) + wrongAttempts * 10; // minutes + wrong attempt penalty
            problemsSolved++;
        }
    }

    await prisma.contestParticipant.update({
        where: { contestId_userId: { contestId, userId } },
        data: { score: Math.max(0, totalScore), penalty: totalPenalty, problemsSolved },
    });

    // Invalidate leaderboard cache
    try {
        await redis.del(`contest_leaderboard:${contestId}`);
    } catch (_) { }
}

// ─── Finalize Contest (rating changes) ────────────────────────────────────────

export async function finalizeContest(contestId: string) {
    const participants = await prisma.contestParticipant.findMany({
        where: { contestId },
        orderBy: [{ score: 'desc' }, { penalty: 'asc' }],
        include: { user: { select: { id: true, rating: true } } },
    });

    if (participants.length === 0) return;

    const total = participants.length;

    for (let i = 0; i < participants.length; i++) {
        const p = participants[i];
        const rank = i + 1;
        const percentile = rank / total;

        // Simplified Elo-style rating change
        let ratingChange = 0;
        if (percentile <= 0.3) {
            // Top 30%: gain rating
            ratingChange = Math.round(30 - percentile * 50);
        } else if (percentile <= 0.7) {
            // Mid 40%: small change
            ratingChange = Math.round(5 - (percentile - 0.3) * 25);
        } else {
            // Bottom 30%: lose rating
            ratingChange = -Math.round(10 + (percentile - 0.7) * 33);
        }

        // Update participant record
        await prisma.contestParticipant.update({
            where: { id: p.id },
            data: { rank, ratingChange },
        });

        // Update user rating
        const currentRating = p.user.rating || 1200;
        await prisma.user.update({
            where: { id: p.userId },
            data: { rating: Math.max(0, currentRating + ratingChange) },
        });
    }
}

// ─── Admin: Announcements ─────────────────────────────────────────────────────

export async function sendAnnouncement(contestId: string, title: string, message: string) {
    const announcement = await prisma.contestAnnouncement.create({
        data: { contestId, title, message },
    });

    // Emit via WebSocket to all participants in the contest room
    try {
        const { getSocketIO } = await import('../socket');
        const io = getSocketIO();
        io.to(`contest_${contestId}`).emit('contest_announcement', {
            contestId,
            announcement,
        });
    } catch (_) { }

    return announcement;
}

export async function getAnnouncements(contestId: string) {
    return prisma.contestAnnouncement.findMany({
        where: { contestId },
        orderBy: { createdAt: 'desc' },
    });
}

// ─── Admin: Ban/Unban Participant ─────────────────────────────────────────────

export async function banParticipant(contestId: string, userId: string, reason?: string) {
    const participant = await prisma.contestParticipant.findUnique({
        where: { contestId_userId: { contestId, userId } },
    });
    if (!participant) throw new Error('Participant not found');

    const updated = await prisma.contestParticipant.update({
        where: { id: participant.id },
        data: {
            isBanned: true,
            bannedReason: reason || 'Cheating detected',
            score: 0,
            rank: null,
            ratingChange: 0,
            problemsSolved: 0,
        },
        include: { user: { select: { id: true, username: true, fullName: true } } },
    });

    // Emit ban notification
    try {
        const { getSocketIO } = await import('../socket');
        const io = getSocketIO();
        io.to(`contest_${contestId}`).emit('participant_banned', {
            contestId,
            userId,
            username: updated.user.username,
        });
    } catch (_) { }

    // Invalidate leaderboard cache
    try {
        await redis.del(`contest_leaderboard:${contestId}`);
    } catch (_) { }

    return updated;
}

export async function unbanParticipant(contestId: string, userId: string) {
    const participant = await prisma.contestParticipant.findUnique({
        where: { contestId_userId: { contestId, userId } },
    });
    if (!participant) throw new Error('Participant not found');

    const updated = await prisma.contestParticipant.update({
        where: { id: participant.id },
        data: { isBanned: false, bannedReason: null },
        include: { user: { select: { id: true, username: true, fullName: true } } },
    });

    // Invalidate leaderboard cache
    try {
        await redis.del(`contest_leaderboard:${contestId}`);
    } catch (_) { }

    return updated;
}

// ─── Admin: View Participant Solutions ────────────────────────────────────────

export async function getParticipantSolutions(contestId: string, userId: string) {
    const participant = await prisma.contestParticipant.findUnique({
        where: { contestId_userId: { contestId, userId } },
        include: { user: { select: { id: true, username: true, fullName: true } } },
    });
    if (!participant) throw new Error('Participant not found');

    const submissions = await prisma.submission.findMany({
        where: { contestId, userId },
        include: {
            problem: { select: { id: true, title: true, slug: true, difficulty: true } },
        },
        orderBy: { createdAt: 'desc' },
    });

    return { participant, submissions };
}

// ─── Admin: List Participants ─────────────────────────────────────────────────

export async function getContestParticipants(contestId: string) {
    return prisma.contestParticipant.findMany({
        where: { contestId },
        include: {
            user: { select: { id: true, username: true, fullName: true, email: true, avatar: true, rating: true } },
        },
        orderBy: [{ score: 'desc' }, { penalty: 'asc' }],
    });
}
