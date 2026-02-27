// frontend/src/components/problem/ProblemSubmissions.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Database, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import api from '@/services/api';
import { Submission, Language } from '@/types';

interface Props {
    problemId: string;
    onLoadCode: (code: string, language: Language) => void;
}

const LANG_LABELS: Record<string, string> = {
    JAVASCRIPT: 'JavaScript',
    PYTHON: 'Python',
    JAVA: 'Java',
    CPP: 'C++',
    C: 'C',
};

const VERDICT_STYLE: Record<string, string> = {
    ACCEPTED: 'text-emerald-400',
    WRONG_ANSWER: 'text-rose-400',
    RUNTIME_ERROR: 'text-orange-400',
    COMPILATION_ERROR: 'text-purple-400',
    TIME_LIMIT_EXCEEDED: 'text-amber-400',
    MEMORY_LIMIT_EXCEEDED: 'text-blue-400',
    PENDING: 'text-gray-400',
    QUEUED: 'text-gray-400',
};

const VERDICT_LABEL: Record<string, string> = {
    ACCEPTED: 'Accepted',
    WRONG_ANSWER: 'Wrong Answer',
    RUNTIME_ERROR: 'Runtime Error',
    COMPILATION_ERROR: 'Compile Error',
    TIME_LIMIT_EXCEEDED: 'TLE',
    MEMORY_LIMIT_EXCEEDED: 'MLE',
    PENDING: 'Pending',
};

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export const ProblemSubmissions: React.FC<Props> = ({ problemId, onLoadCode }) => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.getUserSubmissions({ problemId, limit: 20 });
            setSubmissions(res?.data?.submissions ?? res?.submissions ?? []);
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, [problemId]);

    useEffect(() => { if (problemId) fetchHistory(); }, [fetchHistory, problemId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-[#FFB22C]" />
            </div>
        );
    }

    if (submissions.length === 0) {
        return (
            <div className="flex flex-col items-center py-16 text-center gap-3">
                <XCircle size={36} className="text-gray-600" />
                <p className="text-gray-400 font-medium">No submissions yet</p>
                <p className="text-gray-600 text-sm">Submit your code to see your history here</p>
            </div>
        );
    }

    return (
        <div className="space-y-2 pb-10">
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{submissions.length} submissions</p>
                <button onClick={fetchHistory} className="p-1.5 hover:bg-[#2B303B] rounded-lg text-gray-500 hover:text-gray-300 transition-colors">
                    <RefreshCw size={13} />
                </button>
            </div>

            <AnimatePresence initial={false}>
                {submissions.map((sub, i) => (
                    <motion.button
                        key={sub.id}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => onLoadCode(sub.code, sub.language as Language)}
                        className="w-full text-left flex items-center justify-between px-4 py-3 rounded-lg bg-[#15181E] hover:bg-[#1E2229] border border-[#2B303B] hover:border-[#383E4B] transition-all group"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            {sub.verdict === 'ACCEPTED'
                                ? <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />
                                : <XCircle size={15} className="text-rose-400 flex-shrink-0" />}
                            <div className="min-w-0">
                                <p className={`text-sm font-semibold ${VERDICT_STYLE[sub.verdict] ?? 'text-gray-400'}`}>
                                    {VERDICT_LABEL[sub.verdict] ?? sub.verdict}
                                </p>
                                <div className="flex items-center gap-3 mt-0.5">
                                    <span className="text-[11px] text-gray-500">{LANG_LABELS[sub.language] ?? sub.language}</span>
                                    {sub.testCasesPassed != null && sub.totalTestCases != null && (
                                        <span className="text-[11px] text-gray-600">{sub.testCasesPassed}/{sub.totalTestCases} cases</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0 text-[11px] text-gray-600">
                            {sub.executionTime != null && (
                                <span className="hidden sm:flex items-center gap-1"><Clock size={11} />{sub.executionTime}ms</span>
                            )}
                            {sub.memoryUsed != null && (
                                <span className="hidden sm:flex items-center gap-1"><Database size={11} />{(sub.memoryUsed / 1024).toFixed(1)}MB</span>
                            )}
                            <span>{timeAgo(sub.createdAt)}</span>
                            <ChevronRight size={13} className="text-gray-700 group-hover:text-gray-400 transition-colors" />
                        </div>
                    </motion.button>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ProblemSubmissions;
