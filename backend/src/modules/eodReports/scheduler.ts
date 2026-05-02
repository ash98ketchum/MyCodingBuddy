import cron from 'node-cron';
import { EODReportService } from './eodReports.service';

/**
 * Initializes the EOD Report Background Job
 * Runs every day at 00:00 (Midnight)
 */
export const initEODScheduler = () => {
    // Cron string: "0 0 * * *" means at minute 0 past hour 0.
    cron.schedule('0 0 * * *', async () => {
        console.log(`⏰ [CRON] Triggering automated EOD Report Generation at ${new Date().toISOString()}`);
        await EODReportService.generateAndSendReports();
    }, {
        timezone: "Asia/Kolkata" // Or read from process.env if specified
    });

    console.log("🕒 EOD Report Scheduler Initialized.");
};
