// backend/src/cron.ts
import cron from 'node-cron';
import prisma from './config/database';
import { initContestScheduler } from './services/contest.scheduler';

export const initCronJobs = () => {
    console.log('⏰ Initializing production cron jobs...');

    // Refresh the materialized view every hour
    cron.schedule('0 * * * *', async () => {
        try {
            console.log('🔄 Refreshing college_student_summary materialized view...');
            await prisma.$executeRaw`REFRESH MATERIALIZED VIEW CONCURRENTLY college_student_summary;`;
            console.log('✅ Successfully refreshed college_student_summary');
        } catch (error) {
            console.error('❌ Failed to refresh materialized view:', error);
        }
    });

    // Initialize contest scheduler (weekly creation + status transitions)
    initContestScheduler();
};
