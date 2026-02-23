import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Database, ChevronRight, Loader2, CheckCircle, XCircle } from 'lucide-react';
import api from '@/services/api';
import { Submission } from '@/types';

interface SubmissionHistoryProps {
    problemId: string;
    onViewDetail: (submission: Submission) => void;
}

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({ problemId, onViewDetail }) => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.getUserSubmissions({ problemId, limit: 10 });
                setSubmissions(res.data?.submissions || []);
            } catch (error) {
                console.error("Failed to fetch submission history", error);
            } finally {
                setLoading(false);
            }
        };

        if (problemId) fetchHistory();
    }, [problemId]);

    const getVerdictStyle = (verdict: string) => {
        if (verdict === 'ACCEPTED') return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
        if (verdict === 'PENDING') return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
        );
    }

    if (submissions.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <p>No previous submissions found for this problem.</p>
                <p className="text-sm mt-1">Submit your code to see your history here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Submission History</h3>
            {submissions.map((sub) => (
                <motion.button
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={sub.id}
                    onClick={() => onViewDetail(sub)}
                    className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 hover:border-accent dark:hover:border-accent transition-all group flex items-center justify-between shadow-sm"
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wide ${getVerdictStyle(sub.verdict)}`}>
                                {sub.verdict.replace(/_/g, ' ')}
                            </span>
                            <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                                {new Date(sub.createdAt).toLocaleDateString()} at {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <div className="flex items-center gap-5 text-sm font-medium text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-dark-800 px-2 py-1 rounded">
                                <span className="uppercase text-xs font-bold text-gray-500">{sub.language}</span>
                            </span>
                            {sub.executionTime !== null && (
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {sub.executionTime}ms
                                </span>
                            )}
                            {sub.memoryUsed !== null && sub.memoryUsed !== undefined && (
                                <span className="flex items-center gap-1.5">
                                    <Database className="w-3.5 h-3.5" />
                                    {(sub.memoryUsed / 1024).toFixed(1)}MB
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm font-medium">View Code</span>
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </motion.button>
            ))}
        </div>
    );
};

export default SubmissionHistory;
