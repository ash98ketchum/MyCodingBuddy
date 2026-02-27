// frontend/src/components/TestResults.tsx
import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronDown, ChevronRight, Clock, Database, AlertTriangle, Terminal } from 'lucide-react';

interface TestResult {
    testCaseNumber: number;
    input: string;
    expectedOutput: string;
    actualOutput?: string;
    passed: boolean;
    executionTime?: number;
    memoryUsed?: number;
    error?: string;
}

interface TestResultsProps {
    verdict: string;
    testCasesPassed: number;
    totalTestCases: number;
    testResults?: TestResult[];
    executionTime?: number;
    memoryUsed?: number;
    errorMessage?: string;
}

const VERDICT_CONFIG: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode; label: string }> = {
    ACCEPTED: {
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        icon: <CheckCircle size={22} className="text-green-400" />,
        label: 'Accepted',
    },
    WRONG_ANSWER: {
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        icon: <XCircle size={22} className="text-red-400" />,
        label: 'Wrong Answer',
    },
    RUNTIME_ERROR: {
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        icon: <AlertTriangle size={22} className="text-orange-400" />,
        label: 'Runtime Error',
    },
    TIME_LIMIT_EXCEEDED: {
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        icon: <Clock size={22} className="text-yellow-400" />,
        label: 'Time Limit Exceeded',
    },
    COMPILATION_ERROR: {
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        icon: <Terminal size={22} className="text-purple-400" />,
        label: 'Compilation Error',
    },
    MEMORY_LIMIT_EXCEEDED: {
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        icon: <Database size={22} className="text-blue-400" />,
        label: 'Memory Limit Exceeded',
    },
};

const DEFAULT_VERDICTCFG = {
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    icon: <XCircle size={22} className="text-gray-400" />,
    label: 'Unknown',
};

export const TestResults: React.FC<TestResultsProps> = ({
    verdict,
    testCasesPassed,
    totalTestCases,
    testResults,
    executionTime,
    memoryUsed,
    errorMessage,
}) => {
    const [expandedTests, setExpandedTests] = useState<Set<number>>(new Set([1]));
    const cfg = VERDICT_CONFIG[verdict] ?? DEFAULT_VERDICTCFG;

    const isErrorVerdict = verdict === 'RUNTIME_ERROR' || verdict === 'COMPILATION_ERROR';
    const isWrongAnswer = verdict === 'WRONG_ANSWER';

    // Find the first failing test case for "Last Executed Input" display
    const firstFailedTest = testResults?.find(t => !t.passed);

    const toggleTest = (testNum: number) => {
        const next = new Set(expandedTests);
        next.has(testNum) ? next.delete(testNum) : next.add(testNum);
        setExpandedTests(next);
    };

    return (
        <div className="space-y-3 font-mono text-sm">
            {/* ── Verdict Header ── */}
            <div className={`flex items-center justify-between px-4 py-3 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                <div className="flex items-center gap-3">
                    {cfg.icon}
                    <div>
                        <p className={`font-bold text-base ${cfg.color}`}>{cfg.label}</p>
                        {!isErrorVerdict && (
                            <p className="text-xs text-gray-500 mt-0.5 font-sans">
                                {testCasesPassed} / {totalTestCases} test cases passed
                            </p>
                        )}
                    </div>
                </div>

                {verdict === 'ACCEPTED' && executionTime && (
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-sans">
                        <span className="flex items-center gap-1.5">
                            <Clock size={13} />
                            {executionTime}ms
                        </span>
                        {memoryUsed && (
                            <span className="flex items-center gap-1.5">
                                <Database size={13} />
                                {(memoryUsed / 1024).toFixed(1)}MB
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* ── LeetCode-style Error Box ── */}
            {isErrorVerdict && errorMessage && (
                <div className="rounded-lg border border-red-500/20 bg-red-950/30 overflow-hidden">
                    <div className="px-3 py-2 border-b border-red-500/20 flex items-center gap-2">
                        <Terminal size={13} className="text-red-400" />
                        <span className="text-xs font-semibold text-red-400 uppercase tracking-wider font-sans">
                            {verdict === 'COMPILATION_ERROR' ? 'Compile Output' : 'Error Output'}
                        </span>
                    </div>
                    <pre className="px-4 py-3 text-xs text-red-300 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-40">
                        {errorMessage}
                    </pre>
                </div>
            )}

            {/* ── Last Executed Input (like LeetCode) ── */}
            {isErrorVerdict && firstFailedTest && (
                <div className="rounded-lg border border-gray-700/50 bg-[#1a1d23] overflow-hidden">
                    <div className="px-3 py-2 border-b border-gray-700/50 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-sans">
                            Last Executed Input
                        </span>
                        <span className="text-xs text-gray-600 font-sans">Test Case {firstFailedTest.testCaseNumber}</span>
                    </div>
                    <pre className="px-4 py-3 text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto">
                        {firstFailedTest.input}
                    </pre>
                </div>
            )}

            {/* ── WRONG_ANSWER: show expected vs actual ── */}
            {isWrongAnswer && firstFailedTest && (
                <div className="space-y-2">
                    <div className="rounded-lg border border-gray-700/50 bg-[#1a1d23] overflow-hidden">
                        <div className="px-3 py-2 border-b border-gray-700/50">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-sans">Input</span>
                        </div>
                        <pre className="px-4 py-3 text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto">{firstFailedTest.input}</pre>
                    </div>
                    <div className="rounded-lg border border-green-700/30 bg-green-950/20 overflow-hidden">
                        <div className="px-3 py-2 border-b border-green-700/30">
                            <span className="text-xs font-semibold text-green-400 uppercase tracking-wider font-sans">Expected Output</span>
                        </div>
                        <pre className="px-4 py-3 text-xs text-green-300 whitespace-pre-wrap overflow-x-auto">{firstFailedTest.expectedOutput}</pre>
                    </div>
                    <div className="rounded-lg border border-red-700/30 bg-red-950/20 overflow-hidden">
                        <div className="px-3 py-2 border-b border-red-700/30">
                            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider font-sans">Your Output</span>
                        </div>
                        <pre className="px-4 py-3 text-xs text-red-300 whitespace-pre-wrap overflow-x-auto">
                            {firstFailedTest.actualOutput || '(empty)'}
                        </pre>
                    </div>
                </div>
            )}

            {/* ── All Test Cases accordion (collapsible) ── */}
            {(testResults ?? []).length > 0 && (
                <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-sans px-1">
                        Test Cases ({testCasesPassed}/{totalTestCases} passed)
                    </p>

                    {(testResults ?? []).map((test) => (
                        <div
                            key={test.testCaseNumber}
                            className="border border-gray-700/50 rounded-lg overflow-hidden"
                        >
                            <button
                                onClick={() => toggleTest(test.testCaseNumber)}
                                className="w-full px-4 py-2.5 bg-[#15181E] hover:bg-[#1e2229] flex items-center justify-between transition-colors"
                            >
                                <div className="flex items-center gap-2.5">
                                    {test.passed ? (
                                        <CheckCircle size={15} className="text-green-400 flex-shrink-0" />
                                    ) : (
                                        <XCircle size={15} className="text-red-400 flex-shrink-0" />
                                    )}
                                    <span className="font-medium text-gray-200 text-xs font-sans">
                                        Case {test.testCaseNumber}
                                    </span>
                                    <span className={`text-xs font-sans ${test.passed ? 'text-green-500' : 'text-red-500'}`}>
                                        {test.passed ? 'Passed' : 'Failed'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {test.executionTime != null && (
                                        <span className="text-xs text-gray-600 font-sans">{test.executionTime}ms</span>
                                    )}
                                    {expandedTests.has(test.testCaseNumber)
                                        ? <ChevronDown size={14} className="text-gray-600" />
                                        : <ChevronRight size={14} className="text-gray-600" />}
                                </div>
                            </button>

                            {expandedTests.has(test.testCaseNumber) && (
                                <div className="px-4 py-3 space-y-2.5 bg-[#0F1115] border-t border-gray-700/50">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 mb-1 font-sans uppercase tracking-wider">Input</p>
                                        <pre className="text-xs bg-[#15181E] px-3 py-2 rounded border border-gray-700/50 overflow-x-auto text-gray-300">
                                            {test.input}
                                        </pre>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 mb-1 font-sans uppercase tracking-wider">Expected</p>
                                        <pre className="text-xs bg-[#15181E] px-3 py-2 rounded border border-gray-700/50 overflow-x-auto text-gray-300">
                                            {test.expectedOutput}
                                        </pre>
                                    </div>
                                    {!test.passed && test.actualOutput !== undefined && !test.error && (
                                        <div>
                                            <p className="text-xs font-semibold text-red-500 mb-1 font-sans uppercase tracking-wider">Your Output</p>
                                            <pre className="text-xs bg-red-950/20 px-3 py-2 rounded border border-red-700/30 overflow-x-auto text-red-300">
                                                {test.actualOutput || '(empty)'}
                                            </pre>
                                        </div>
                                    )}
                                    {test.error && (
                                        <div>
                                            <p className="text-xs font-semibold text-orange-500 mb-1 font-sans uppercase tracking-wider">Error</p>
                                            <pre className="text-xs bg-orange-950/20 px-3 py-2 rounded border border-orange-700/30 overflow-x-auto text-orange-300 whitespace-pre-wrap">
                                                {test.error}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TestResults;
