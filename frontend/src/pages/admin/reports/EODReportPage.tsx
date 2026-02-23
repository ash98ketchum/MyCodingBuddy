import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Loader2, CheckCircle2, AlertCircle, Clock, Send } from 'lucide-react';
import { useEODReportStore } from '../../../store/eodReportStore';

export const EODReportPage: React.FC = () => {
    const {
        statusMessage,
        isGenerating,
        lastGeneratedAt,
        fetchStatus,
        generateReport
    } = useEODReportStore();

    useEffect(() => {
        fetchStatus();
        // Poll status every 10 seconds if generating
        let interval: ReturnType<typeof setInterval>;
        if (isGenerating) {
            interval = setInterval(fetchStatus, 10000);
        }
        return () => clearInterval(interval);
    }, [isGenerating, fetchStatus]);

    const handleGenerate = () => {
        generateReport();
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-accent-600 bg-clip-text text-transparent mb-2">
                    End-of-Day Reports
                </h1>
                <p className="text-gray-500">
                    Trigger the automated EOD Excel Analytics generator containing Student Performance, AI Code Quality, and Integrity insights.
                </p>
            </div>

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden relative shadow-lg"
            >
                {/* Glow Effects */}
                <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50 blur-sm" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="p-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

                        {/* Status Section */}
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-sm">
                                    <FileSpreadsheet className="w-6 h-6 text-accent-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Report Generator</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        {isGenerating ? (
                                            <span className="flex items-center text-accent text-sm font-medium">
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Generating...
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-green-600 text-sm font-medium">
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Ready
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-inner">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Last Generated
                                    </span>
                                    <span className="text-gray-900 font-medium">
                                        {lastGeneratedAt ? new Date(lastGeneratedAt).toLocaleString() : 'Never'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" /> System Status
                                    </span>
                                    <span className={`font-medium ${statusMessage.includes('Failed') ? 'text-red-500' : 'text-blue-600'}`}>
                                        {statusMessage}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Section */}
                        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100 md:min-w-[300px] gap-4">
                            <motion.button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                                    w-full py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg transition-all
                                    ${isGenerating
                                        ? 'bg-accent/50 text-white cursor-not-allowed border border-accent/20 shadow-none'
                                        : 'bg-accent text-white hover:bg-accent-600 shadow-accent hover:shadow-accent-lg'
                                    }
                                `}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-6 h-6" />
                                        Dispatch Email
                                    </>
                                )}
                            </motion.button>

                            <motion.button
                                onClick={async () => {
                                    try {
                                        const adminStorage = localStorage.getItem('admin-storage');
                                        let token = '';
                                        if (adminStorage) {
                                            const parsed = JSON.parse(adminStorage);
                                            token = parsed.state?.token;
                                        }

                                        // @ts-ignore: Vite env var
                                        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

                                        const res = await fetch(`${baseURL}/admin/reports/eod/download`, {
                                            method: 'GET',
                                            headers: {
                                                'Authorization': `Bearer ${token}`
                                            }
                                        });

                                        if (!res.ok) throw new Error('Failed to download report');

                                        const blob = await res.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `EOD_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
                                        document.body.appendChild(a);
                                        a.click();
                                        a.remove();
                                        window.URL.revokeObjectURL(url);
                                    } catch (err) {
                                        console.error(err);
                                        alert("Failed to download Excel Report.");
                                    }
                                }}
                                disabled={isGenerating}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                                    w-full py-3 px-6 rounded-xl flex items-center justify-center gap-3 font-semibold text-accent transition-all
                                    border-2 border-accent/20 hover:border-accent hover:bg-accent/5
                                    ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <FileSpreadsheet className="w-5 h-5" />
                                Download Excel
                            </motion.button>

                            <p className="mt-2 text-xs text-gray-500 text-center max-w-[200px]">
                                Download directly or email securely to the admin address.
                            </p>
                        </div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default EODReportPage;
