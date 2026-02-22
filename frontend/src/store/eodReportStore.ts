import { create } from 'zustand';
import axios from 'axios';
import { adminApi } from '../services/adminAuthApi'; // utilize existing admin axios instance

interface EODReportState {
    statusMessage: string;
    isGenerating: boolean;
    lastGeneratedAt: string | null;
    fetchStatus: () => Promise<void>;
    generateReport: () => Promise<void>;
}

export const useEODReportStore = create<EODReportState>((set, get) => ({
    statusMessage: 'Idle',
    isGenerating: false,
    lastGeneratedAt: null,

    fetchStatus: async () => {
        try {
            const response: any = await adminApi.api.get('/admin/reports/eod/status');
            if (response.success) {
                set({
                    isGenerating: response.data.isGenerating,
                    lastGeneratedAt: response.data.lastGeneratedAt,
                    statusMessage: response.data.statusMessage
                });
            }
        } catch (error) {
            console.error('Failed to fetch EOD report status:', error);
        }
    },

    generateReport: async () => {
        if (get().isGenerating) return;

        set({ isGenerating: true, statusMessage: 'Initiating report generation...' });

        try {
            const response: any = await adminApi.api.post('/admin/reports/eod/generate');
            if (response.success) {
                set({ statusMessage: response.message });
            }
        } catch (error: any) {
            console.error('Failed to generate EOD report:', error);
            set({
                isGenerating: false,
                statusMessage: error.response?.data?.message || 'Failed to trigger report generation'
            });
        }
    },
}));
