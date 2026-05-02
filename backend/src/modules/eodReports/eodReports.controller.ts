import { Request, Response } from 'express';
import { EODReportService } from './eodReports.service';

// In-memory status tracking for the admin dashboard
let reportStatus = {
    isGenerating: false,
    lastGeneratedAt: null as Date | null,
    statusMessage: 'Idle'
};

export const eodReportsController = {
    triggerManualReport: async (req: Request, res: Response) => {
        if (reportStatus.isGenerating) {
            return res.status(400).json({ success: false, message: 'Report is already generating.' });
        }

        reportStatus.isGenerating = true;
        reportStatus.statusMessage = 'Generating EOD Reports via ExcelJS...';

        // Do not await to avoid blocking the HTTP request
        EODReportService.generateAndSendReports()
            .then((success) => {
                reportStatus.isGenerating = false;
                if (success) {
                    reportStatus.lastGeneratedAt = new Date();
                    reportStatus.statusMessage = 'Completed Successfully';
                } else {
                    reportStatus.statusMessage = 'Skipped or Failed';
                }
            })
            .catch((err) => {
                reportStatus.isGenerating = false;
                reportStatus.statusMessage = 'Failed due to an error';
                console.error(err);
            });

        return res.json({
            success: true,
            message: 'EOD Report generation triggered successfully. It will be emailed shortly.'
        });
    },

    downloadReport: async (req: Request, res: Response) => {
        try {
            const workbook = await EODReportService.generateWorkbook();
            if (!workbook) {
                return res.status(404).json({ success: false, message: 'No data to generate report.' });
            }

            const dateStr = new Date().toISOString().split('T')[0];
            const fileName = `EOD_Report_${dateStr}.xlsx`;

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

            await (workbook.xlsx as any).write(res);
            res.end();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Failed to download report.' });
        }
    },

    getReportStatus: async (req: Request, res: Response) => {
        return res.json({
            success: true,
            data: reportStatus
        });
    }
};
