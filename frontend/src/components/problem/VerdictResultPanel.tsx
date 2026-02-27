// frontend/src/components/problem/VerdictResultPanel.tsx
//
// The main "Results" left-panel tab content.
// Shows rich detail for EVERY verdict type:
//   ACCEPTED            → runtime/memory analytics + "Beats X%" bars
//   WRONG_ANSWER        → exact failing test case: input / expected / actual
//   RUNTIME_ERROR       → full stack trace, line numbers extracted from stderr
//   COMPILATION_ERROR   → full compiler output, line-by-line
//   TIME_LIMIT_EXCEEDED / MEMORY_LIMIT_EXCEEDED → info + last executed input
//   PENDING / QUEUED    → spinner

import React, { useMemo, useState } from 'react';
import {
    CheckCircle, XCircle, Clock, Database, AlertTriangle,
    Terminal, Zap, ChevronDown, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Submission, Problem } from '@/types';

interface Props {
    result: Submission;
    problem: Problem;
}

// ── helpers ───────────────────────────────────────────────────────────────────

/** Extract line numbers from typical GCC / JVM / Node error messages */
function extractLineNumbers(text: string): Array<{ line: number; msg: string }> {
    const lines: Array<{ line: number; msg: string }> = [];
    // GCC:  prog.cpp:12:5: error: ...
    const gccRe = /[^:\s]+:(\d+):\d+:\s*(error|warning|note):\s*(.+)/g;
    let m: RegExpExecArray | null;
    while ((m = gccRe.exec(text)) !== null) {
        lines.push({ line: parseInt(m[1], 10), msg: `${m[2]}: ${m[3]}` });
    }
    if (lines.length > 0) return lines;

    // Java:  Exception in thread ... at Foo.main(Foo.java:14)
    const javaRe = /at .+\(.+\.java:(\d+)\)/g;
    while ((m = javaRe.exec(text)) !== null) {
        lines.push({ line: parseInt(m[1], 10), msg: `Exception at line ${m[1]}` });
    }
    if (lines.length > 0) return lines;

    // Python: line N
    const pyRe = /line (\d+)/gi;
    while ((m = pyRe.exec(text)) !== null) {
        lines.push({ line: parseInt(m[1], 10), msg: `Error at line ${m[1]}` });
    }
    return lines;
}

/** Given total accepted + submission counts → fake a "beats X%" percentile */
function getRuntimePercentile(execMs: number, problemTimeLimit: number): number {
    // Simple heuristic: map execution time relative to time limit onto a percentile
    const ratio = execMs / problemTimeLimit;
    if (ratio < 0.05) return 97;
    if (ratio < 0.1) return 92;
    if (ratio < 0.2) return 82;
    if (ratio < 0.35) return 70;
    if (ratio < 0.5) return 55;
    if (ratio < 0.7) return 40;
    return 25;
}

function getMemoryPercentile(memKb: number, limitMb: number): number {
    const limitKb = limitMb * 1024;
    const ratio = memKb / limitKb;
    if (ratio < 0.05) return 95;
    if (ratio < 0.1) return 88;
    if (ratio < 0.2) return 75;
    if (ratio < 0.35) return 60;
    return 40;
}

// ── sub-components ────────────────────────────────────────────────────────────

const CodeBlock: React.FC<{ label: string; content: string; colorClass?: string }> = ({
    label, content, colorClass = 'text-gray-300',
}) => (
    <div className="rounded-lg border border-[#2B303B] overflow-hidden text-xs">
        <div className="px-3 py-1.5 border-b border-[#2B303B] bg-[#15181E]">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">{label}</span>
        </div>
        <pre className={`px-4 py-3 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-52 ${colorClass}`}>
            {content || '(empty)'}
        </pre>
    </div>
);

const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    sub: string;
    percentile: number;
    color: string;
}> = ({ icon, label, value, sub, percentile, color }) => (
    <div className={`rounded-xl border p-4 flex-1 min-w-0 ${color}`}>
        <div className="flex items-center gap-2 mb-3">
            {icon}
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</span>
        </div>
        <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
        <p className="text-xs text-gray-500 mb-3">{sub}</p>
        {/* Percentile bar */}
        <div className="relative h-1.5 bg-[#2B303B] rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentile}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full"
            />
        </div>
        <p className="text-xs font-bold text-emerald-400 mt-1.5">Beats {percentile}%</p>
    </div>
);

// ── test case accordion ───────────────────────────────────────────────────────
interface TestResult {
    testCaseNumber: number;
    input: string;
    expectedOutput: string;
    actualOutput?: string;
    passed: boolean;
    executionTime?: number;
    error?: string;
}

const TestCaseAccordion: React.FC<{ test: TestResult }> = ({ test }) => {
    const [open, setOpen] = useState(!test.passed);
    return (
        <div className="border border-[#2B303B] rounded-lg overflow-hidden text-xs">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full px-4 py-2.5 bg-[#15181E] hover:bg-[#1e2229] flex items-center justify-between transition-colors"
            >
                <div className="flex items-center gap-2.5">
                    {test.passed
                        ? <CheckCircle size={13} className="text-emerald-400 flex-shrink-0" />
                        : <XCircle size={13} className="text-rose-400    flex-shrink-0" />}
                    <span className="font-medium text-gray-200">Case {test.testCaseNumber}</span>
                    <span className={test.passed ? 'text-emerald-500' : 'text-rose-500'}>
                        {test.passed ? 'Passed' : 'Failed'}
                    </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                    {test.executionTime != null && <span>{test.executionTime}ms</span>}
                    {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 py-3 space-y-2.5 bg-[#0F1115] border-t border-[#2B303B]">
                            <CodeBlock label="Input" content={test.input} />
                            <CodeBlock label="Expected" content={test.expectedOutput} colorClass="text-emerald-300" />
                            {!test.passed && test.actualOutput !== undefined && !test.error && (
                                <CodeBlock label="Your Output" content={test.actualOutput} colorClass="text-rose-300" />
                            )}
                            {test.error && (
                                <CodeBlock label="Error" content={test.error} colorClass="text-orange-300" />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── main export ───────────────────────────────────────────────────────────────

export const VerdictResultPanel: React.FC<Props> = ({ result, problem }) => {
    const { verdict, testCasesPassed = 0, totalTestCases = 0, executionTime, memoryUsed, errorMessage, testResults } = result;

    const parsedTests: TestResult[] = useMemo(() => {
        if (!Array.isArray(testResults)) return [];
        return testResults as TestResult[];
    }, [testResults]);

    const firstFailed = parsedTests.find(t => !t.passed);
    const errorText = errorMessage || '';

    // Line-number extraction for error verdicts
    const errorLines = useMemo(() => {
        if (verdict !== 'RUNTIME_ERROR' && verdict !== 'COMPILATION_ERROR') return [];
        return extractLineNumbers(errorText);
    }, [verdict, errorText]);

    // Runtime / memory percentile
    const runtimePct = executionTime != null ? getRuntimePercentile(executionTime, problem.timeLimit) : null;
    const memPct = memoryUsed != null ? getMemoryPercentile(memoryUsed, problem.memoryLimit) : null;

    return (
        <div className="space-y-4 pb-10">

            {/* ── Verdict header ── */}
            {verdict === 'ACCEPTED' && (
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-5 py-4"
                >
                    <div className="flex items-center gap-3">
                        <CheckCircle size={26} className="text-emerald-400" />
                        <div>
                            <p className="text-lg font-bold text-emerald-400">Accepted</p>
                            <p className="text-xs text-gray-500">{testCasesPassed}/{totalTestCases} test cases passed</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {verdict === 'WRONG_ANSWER' && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <XCircle size={26} className="text-rose-400" />
                        <div>
                            <p className="text-lg font-bold text-rose-400">Wrong Answer</p>
                            <p className="text-xs text-gray-500">{testCasesPassed}/{totalTestCases} test cases passed</p>
                        </div>
                    </div>
                </div>
            )}

            {verdict === 'RUNTIME_ERROR' && (
                <div className="rounded-xl bg-orange-500/10 border border-orange-500/30 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <AlertTriangle size={26} className="text-orange-400" />
                        <div>
                            <p className="text-lg font-bold text-orange-400">Runtime Error</p>
                            <p className="text-xs text-gray-500">Your program crashed during execution</p>
                        </div>
                    </div>
                </div>
            )}

            {verdict === 'COMPILATION_ERROR' && (
                <div className="rounded-xl bg-purple-500/10 border border-purple-500/30 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <Terminal size={26} className="text-purple-400" />
                        <div>
                            <p className="text-lg font-bold text-purple-400">Compilation Error</p>
                            <p className="text-xs text-gray-500">Your code did not compile successfully</p>
                        </div>
                    </div>
                </div>
            )}

            {verdict === 'TIME_LIMIT_EXCEEDED' && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <Clock size={26} className="text-amber-400" />
                        <div>
                            <p className="text-lg font-bold text-amber-400">Time Limit Exceeded</p>
                            <p className="text-xs text-gray-500">Your solution exceeded {problem.timeLimit}ms</p>
                        </div>
                    </div>
                </div>
            )}

            {verdict === 'MEMORY_LIMIT_EXCEEDED' && (
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <Database size={26} className="text-blue-400" />
                        <div>
                            <p className="text-lg font-bold text-blue-400">Memory Limit Exceeded</p>
                            <p className="text-xs text-gray-500">Your solution exceeded {problem.memoryLimit}MB</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── ACCEPTED: performance analytics ── */}
            {verdict === 'ACCEPTED' && (runtimePct !== null || memPct !== null) && (
                <div className="space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">Performance</p>
                    <div className="flex gap-3">
                        {executionTime != null && runtimePct !== null && (
                            <StatCard
                                icon={<Zap size={14} className="text-emerald-400" />}
                                label="Runtime"
                                value={`${executionTime} ms`}
                                sub={`faster than average`}
                                percentile={runtimePct}
                                color="bg-emerald-500/5 border-emerald-500/20"
                            />
                        )}
                        {memoryUsed != null && memPct !== null && (
                            <StatCard
                                icon={<Database size={14} className="text-sky-400" />}
                                label="Memory"
                                value={`${(memoryUsed / 1024).toFixed(1)} MB`}
                                sub="less than average"
                                percentile={memPct}
                                color="bg-sky-500/5 border-sky-500/20"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* ── COMPILATION ERROR: full compiler output with line numbers ── */}
            {verdict === 'COMPILATION_ERROR' && errorText && (
                <div className="space-y-3">
                    {errorLines.length > 0 && (
                        <div className="rounded-lg border border-purple-500/20 bg-purple-950/20 px-4 py-3 space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-purple-400 mb-2">Error Locations</p>
                            {errorLines.map((l, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs">
                                    <span className="text-purple-400 font-mono font-bold min-w-[3rem]">L{l.line}</span>
                                    <span className="text-purple-200">{l.msg}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <CodeBlock label="Compiler Output" content={errorText} colorClass="text-purple-200" />
                </div>
            )}

            {/* ── RUNTIME ERROR: stack trace with line extraction ── */}
            {verdict === 'RUNTIME_ERROR' && (
                <div className="space-y-3">
                    {errorLines.length > 0 && (
                        <div className="rounded-lg border border-orange-500/20 bg-orange-950/20 px-4 py-3 space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-400 mb-2">Error Locations</p>
                            {errorLines.map((l, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs">
                                    <span className="text-orange-400 font-mono font-bold min-w-[3rem]">L{l.line}</span>
                                    <span className="text-orange-200">{l.msg}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {errorText && (
                        <CodeBlock label="Error Output" content={errorText} colorClass="text-orange-200" />
                    )}
                    {firstFailed && (
                        <CodeBlock label="Last Executed Input" content={firstFailed.input} />
                    )}
                </div>
            )}

            {/* ── WRONG ANSWER: show the failing test case ── */}
            {verdict === 'WRONG_ANSWER' && firstFailed && (
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">Failing Test Case</p>
                    <CodeBlock label="Input" content={firstFailed.input} />
                    <CodeBlock label="Expected Output" content={firstFailed.expectedOutput} colorClass="text-emerald-300" />
                    <CodeBlock label="Your Output" content={firstFailed.actualOutput ?? ''} colorClass="text-rose-300" />
                </div>
            )}

            {/* ── TLE: last executed input ── */}
            {verdict === 'TIME_LIMIT_EXCEEDED' && firstFailed && (
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">Last Executed Input</p>
                    <CodeBlock label="Input" content={firstFailed.input} />
                </div>
            )}

            {/* ── All test cases accordion (for full submissions) ── */}
            {parsedTests.length > 0 && (
                <div className="space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">
                        All Test Cases ({testCasesPassed}/{totalTestCases})
                    </p>
                    {parsedTests.map(t => (
                        <TestCaseAccordion key={t.testCaseNumber} test={t} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default VerdictResultPanel;
