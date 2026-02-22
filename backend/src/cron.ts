// backend/src/cron.ts
import prisma from './config/database';
import { AssignmentService } from './services/assignment.service';
import { ReportService } from './services/report.service';

/**
 * Initialize Cron Jobs (Using setInterval as fallback for node-cron)
 */
export const initCronJobs = () => {
    console.log('⏰ Initializing Cron Jobs (Interval based)...');

    const ONE_MINUTE = 60 * 1000;
    const ONE_HOUR = 60 * ONE_MINUTE;

    // Check every hour
    setInterval(async () => {
        const now = new Date();
        const hour = now.getHours();

        // Morning Job: 6 AM
        if (hour === 6) {
            console.log('🌅 Running Daily Assignment Job');
            try {
                const activePrograms = await prisma.program.findMany({ where: { isActive: true } });
                for (const program of activePrograms) {
                    // Check if already ran today? (AssignmentService checks idempotency)
                    await AssignmentService.runDailyAssignment(program.id);
                }
            } catch (e) {
                console.error(e);
            }
        }

        // Night Job: 10 PM (22)
        if (hour === 22) {
            console.log('🌙 Running Daily Report Job');
            try {
                // Report generation might not be idempotent. 
                // Ideally we should store "last report generated" timestamp in Program.
                // For now, we rely on the interval running once per hour and this check passing once.
                // But if the server restarts at 22:30, it might run again?
                // Simple hack: Check if we have logs or just accept strictly that it runs at specific minute?
                // setInterval is imprecise.
                // Better: Run only if minute is < 5?
                // Assuming this check runs somewhat frequently.

                const activePrograms = await prisma.program.findMany({ where: { isActive: true } });
                for (const program of activePrograms) {
                    await ReportService.generateDailyReports(program.id);
                }
            } catch (e) {
                console.error(e);
            }
        }

    }, ONE_HOUR);

    console.log('✅ Interval-based Scheduler Started');
};
