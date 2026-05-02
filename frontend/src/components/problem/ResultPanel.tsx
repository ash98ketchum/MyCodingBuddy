// frontend/src/components/problem/ResultPanel.tsx
//
// Sliding bottom panel on the RIGHT side.
// Two tabs:
//   Testcase   → custom stdin textarea + Run button
//   Test Result → shows TestResults component when a result is available

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, Terminal } from 'lucide-react';
import TestResults from '@/components/TestResults';
import { Submission } from '@/types';

interface Props {
    result: Submission | null;
    isRunning: boolean;
    isSubmitting: boolean;
    sampleInput: string;                 // default stdin from problem
    onRun: (customInput: string) => void;
    active: 'testcase' | 'result';
    onTabChange: (t: 'testcase' | 'result') => void;
    totalTestCases: number;
}

const TAB_CLASSES = (active: boolean) =>
    `px-4 py-2.5 text-sm font-medium transition-all border-b-2 ${active
        ? 'text-[#FFB22C] border-[#FFB22C]'
        : 'text-gray-500 border-transparent hover:text-gray-300'
    }`;

export const ResultPanel: React.FC<Props> = ({
    result, isRunning, isSubmitting, sampleInput, onRun,
    active, onTabChange, totalTestCases,
}) => {
    const [customInput, setCustomInput] = useState(sampleInput);
    const isJudging = isRunning || isSubmitting;

    return (
        <div className="flex flex-col h-full bg-[#0F1115] border-t border-[#2B303B]">
            {/* Tab bar */}
            <div className="flex items-center border-b border-[#2B303B] bg-[#15181E] px-2">
                <button className={TAB_CLASSES(active === 'testcase')} onClick={() => onTabChange('testcase')}>
                    <span className="flex items-center gap-1.5"><Terminal size={13} />Testcase</span>
                </button>
                <button className={TAB_CLASSES(active === 'result')} onClick={() => onTabChange('result')}>
                    Test Result
                    {result && (
                        <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${result.verdict === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                            {result.verdict === 'ACCEPTED' ? '✓' : '✗'}
                        </span>
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {active === 'testcase' && (
                        <motion.div
                            key="testcase"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.12 }}
                            className="p-4 space-y-3"
                        >
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">Custom Input</label>
                                <textarea
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    placeholder="Enter your test case input..."
                                    rows={5}
                                    className="w-full bg-[#1a1d23] border border-[#2B303B] rounded-lg px-3 py-2.5 text-sm font-mono text-gray-300 resize-vertical focus:outline-none focus:border-[#FFB22C]/50 focus:ring-1 focus:ring-[#FFB22C]/20 placeholder-gray-700"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-600">Click <span className="text-gray-400">Run</span> in the editor toolbar to test against this input</p>
                                <button
                                    onClick={() => onRun(customInput)}
                                    disabled={isJudging || !customInput.trim()}
                                    className="flex items-center gap-2 px-4 py-1.5 bg-[#2B303B] hover:bg-[#383E4B] disabled:opacity-40 text-white text-sm rounded-lg transition-all border border-[#383E4B]"
                                >
                                    <Play size={13} className={isRunning ? 'animate-spin' : ''} />
                                    {isRunning ? 'Running...' : 'Run'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {active === 'result' && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.12 }}
                            className="p-4"
                        >
                            {isJudging ? (
                                <div className="flex flex-col items-center justify-center py-8 gap-3">
                                    <div className="w-8 h-8 border-2 border-[#FFB22C] border-t-transparent rounded-full animate-spin" />
                                    <p className="text-gray-400 text-sm">{isSubmitting ? 'Submitting…' : 'Running…'}</p>
                                </div>
                            ) : result ? (
                                <TestResults
                                    verdict={result.verdict}
                                    testCasesPassed={result.testCasesPassed ?? 0}
                                    totalTestCases={result.totalTestCases ?? totalTestCases}
                                    testResults={result.testResults as any}
                                    executionTime={result.executionTime}
                                    memoryUsed={result.memoryUsed}
                                    errorMessage={result.errorMessage}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 gap-2">
                                    <ChevronDown size={28} className="text-gray-700" />
                                    <p className="text-gray-500 text-sm">Run or Submit your code to see results</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ResultPanel;
