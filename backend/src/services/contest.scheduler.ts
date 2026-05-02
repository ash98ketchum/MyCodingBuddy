// backend/src/services/contest.scheduler.ts
import cron from 'node-cron';
import prisma from '../config/database';
import { getSocketIO } from '../socket';
import { finalizeContest } from './contest.service';

// ─── Auto-create Monday & Friday contests ─────────────────────────────────────

/**
 * Runs every Sunday at 11:00 PM IST.
 * Creates the next Monday (WEEKLY_START) and Friday (WEEKLY_END) contests
 * if they don't already exist for that week.
 */
async function createWeeklyContests() {
    console.log('🏆 [Contest Scheduler] Creating weekly contests...');

    const now = new Date();

    // Next Monday
    const monday = new Date(now);
    monday.setDate(now.getDate() + ((1 - now.getDay() + 7) % 7 || 7)); // next Monday
    monday.setHours(20, 0, 0, 0); // 8:00 PM IST

    // Next Friday
    const friday = new Date(now);
    friday.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7 || 7)); // next Friday
    friday.setHours(20, 0, 0, 0); // 8:00 PM IST

    // Check if Monday contest already exists this week
    const mondayStart = new Date(monday);
    mondayStart.setHours(0, 0, 0, 0);
    const mondayEnd = new Date(monday);
    mondayEnd.setHours(23, 59, 59, 999);

    const existingMonday = await prisma.contest.findFirst({
        where: {
            contestType: 'WEEKLY_START',
            startTime: { gte: mondayStart, lte: mondayEnd },
        },
    });

    if (!existingMonday) {
        await createAutoContest(
            'Start of the Week Challenge',
            'WEEKLY_START',
            monday,
            'Kick off the week with competitive coding! Solve problems, climb the leaderboard, and earn rating points.'
        );
    }

    // Check if Friday contest already exists this week
    const fridayStart = new Date(friday);
    fridayStart.setHours(0, 0, 0, 0);
    const fridayEnd = new Date(friday);
    fridayEnd.setHours(23, 59, 59, 999);

    const existingFriday = await prisma.contest.findFirst({
        where: {
            contestType: 'WEEKLY_END',
            startTime: { gte: fridayStart, lte: fridayEnd },
        },
    });

    if (!existingFriday) {
        await createAutoContest(
            'End of the Week Showdown',
            'WEEKLY_END',
            friday,
            'Close out the week with a final challenge! Compete against your peers and finish strong.'
        );
    }
}

async function createAutoContest(
    title: string,
    type: 'WEEKLY_START' | 'WEEKLY_END',
    startTime: Date,
    description: string
) {
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
    const dateStr = startTime.toISOString().slice(0, 10);
    const slug = `${type.toLowerCase().replace('_', '-')}-${dateStr}`;

    // Pick random problems: 2 Easy, 2 Medium, 1 Hard
    const easyProblems = await prisma.problem.findMany({
        where: { difficulty: 'EASY' },
        select: { id: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
    });
    const mediumProblems = await prisma.problem.findMany({
        where: { difficulty: 'MEDIUM' },
        select: { id: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
    });
    const hardProblems = await prisma.problem.findMany({
        where: { difficulty: 'HARD' },
        select: { id: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
    });

    // Shuffle and pick
    const shuffle = <T>(arr: T[]): T[] => arr.sort(() => Math.random() - 0.5);
    const selectedEasy = shuffle(easyProblems).slice(0, 2);
    const selectedMedium = shuffle(mediumProblems).slice(0, 2);
    const selectedHard = shuffle(hardProblems).slice(0, 1);

    const problems = [
        ...selectedEasy.map((p, i) => ({ problemId: p.id, order: i + 1, points: 100 })),
        ...selectedMedium.map((p, i) => ({ problemId: p.id, order: selectedEasy.length + i + 1, points: 200 })),
        ...selectedHard.map((p, i) => ({ problemId: p.id, order: selectedEasy.length + selectedMedium.length + i + 1, points: 300 })),
    ];

    if (problems.length === 0) {
        console.warn(`⚠️  [Contest Scheduler] No problems available for ${title}, skipping.`);
        return;
    }

    await prisma.contest.create({
        data: {
            title: `${title} — ${dateStr}`,
            slug,
            description,
            startTime,
            endTime,
            duration: 120, // 2 hours in minutes
            contestType: type,
            status: 'UPCOMING',
            isPublic: true,
            ratingChange: true,
            problems: { create: problems },
        },
    });

    console.log(`✅ [Contest Scheduler] Created ${type} contest for ${dateStr}`);
}

// ─── Status Transitions ─────────────────────────────────────────────────────

/**
 * Runs every minute. Transitions:
 *   UPCOMING → ACTIVE  when startTime passes
 *   ACTIVE   → ENDED   when endTime passes (+ finalize)
 */
async function transitionContestStatuses() {
    const now = new Date();
    const io = getSocketIO();

    // UPCOMING → ACTIVE
    const toActivate = await prisma.contest.findMany({
        where: { status: 'UPCOMING', startTime: { lte: now } },
    });
    for (const c of toActivate) {
        await prisma.contest.update({ where: { id: c.id }, data: { status: 'ACTIVE' } });
        console.log(`🟢 [Contest] ${c.title} is now ACTIVE`);
        io?.to(`contest_${c.id}`).emit('contest_started', { contestId: c.id, title: c.title });
    }

    // ACTIVE → ENDED
    const toEnd = await prisma.contest.findMany({
        where: { status: 'ACTIVE', endTime: { lte: now } },
    });
    for (const c of toEnd) {
        await prisma.contest.update({ where: { id: c.id }, data: { status: 'ENDED' } });
        console.log(`🔴 [Contest] ${c.title} has ENDED`);

        // Finalize ranking and ratings
        if (c.ratingChange) {
            try {
                await finalizeContest(c.id);
                console.log(`🏅 [Contest] Ratings updated for ${c.title}`);
            } catch (err) {
                console.error(`❌ [Contest] Rating finalization failed for ${c.title}:`, err);
            }
        }

        io?.to(`contest_${c.id}`).emit('contest_ended', { contestId: c.id, title: c.title });
    }
}

// ─── Initialize Scheduler ────────────────────────────────────────────────────

export function initContestScheduler() {
    console.log('🏆 [Contest Scheduler] Initializing...');

    // Create weekly contests every Sunday at 11 PM (IST offset: 17:30 UTC)
    // For IST 11 PM = 17:30 UTC
    cron.schedule('30 17 * * 0', async () => {
        try {
            await createWeeklyContests();
        } catch (err) {
            console.error('❌ [Contest Scheduler] Failed to create weekly contests:', err);
        }
    });

    // Transition contest statuses every minute
    cron.schedule('* * * * *', async () => {
        try {
            await transitionContestStatuses();
        } catch (err) {
            console.error('❌ [Contest Scheduler] Status transition error:', err);
        }
    });

    // Run an initial check right away
    transitionContestStatuses().catch(console.error);

    console.log('✅ [Contest Scheduler] Scheduled: weekly creation (Sun 11PM IST) + status checks (every min)');
}

// Export for manual triggering (admin or testing)
export { createWeeklyContests, transitionContestStatuses };
