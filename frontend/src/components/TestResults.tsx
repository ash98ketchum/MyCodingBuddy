// frontend/src/components/TestResults.tsx
import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronDown, ChevronRight, Clock, Database } from 'lucide-react';

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

export const TestResults: React.FC<TestResultsProps> = ({
    verdict,
    testCasesPassed,
    totalTestCases,
    testResults = [],
    executionTime,
    memoryUsed,
    errorMessage,
}) => {
    const [expandedTests, setExpandedTests] = useState<Set<number>>(new Set([1]));

    const toggleTest = (testNum: number) => {
        const newExpanded = new Set(expandedTests);
        if (newExpanded.has(testNum)) {
            newExpanded.delete(testNum);
        } else {
            newExpanded.add(testNum);
        }
        setExpandedTests(newExpanded);
    };

    const getVerdictColor = () => {
        if (verdict === 'ACCEPTED') return 'text-green-600 dark:text-green-400';
        if (verdict === 'WRONG_ANSWER') return 'text-red-600 dark:text-red-400';
        if (verdict === 'RUNTIME_ERROR') return 'text-orange-600 dark:text-orange-400';
        if (verdict === 'TIME_LIMIT_EXCEEDED') return 'text-yellow-600 dark:text-yellow-400';
        if (verdict === 'COMPILATION_ERROR') return 'text-purple-600 dark:text-purple-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    const getVerdictBg = () => {
        if (verdict === 'ACCEPTED') return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
        if (verdict === 'WRONG_ANSWER') return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        if (verdict === 'RUNTIME_ERROR') return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
        if (verdict === 'TIME_LIMIT_EXCEEDED') return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
        if (verdict === 'COMPILATION_ERROR') return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    };

    return (
        <div className="space-y-4">
            {/* Verdict Header */}
            <div className={`p-4 rounded-lg border-2 ${getVerdictBg()}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {verdict === 'ACCEPTED' ? (
                            <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                        ) : (
                            <XCircle className="text-red-600 dark:text-red-400" size={24} />
                        )}
                        <div>
                            <p className={`font-bold text-lg ${getVerdictColor()}`}>
                                {verdict.replace(/_/g, ' ')}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {testCasesPassed} / {totalTestCases} test cases passed
                            </p>
                        </div>
                    </div>

                    {verdict === 'ACCEPTED' && executionTime && (
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-500" />
                                <span className="text-gray-700 dark:text-gray-300">{executionTime}ms</span>
                            </div>
                            {memoryUsed && (
                                <div className="flex items-center gap-2">
                                    <Database size={16} className="text-gray-500" />
                                    <span className="text-gray-700 dark:text-gray-300">{(memoryUsed / 1024).toFixed(2)}MB</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {
                errorMessage && verdict !== 'ACCEPTED' && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Error:</p>
                        <pre className="text-sm text-red-700 dark:text-red-300 font-mono whitespace-pre-wrap">{errorMessage}</pre>
                    </div>
                )
            }

            {/* Test Cases */}
            {
                testResults.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Test Cases</h3>

                        {testResults.map((test) => (
                            <div
                                key={test.testCaseNumber}
                                className="border-2 border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden"
                            >
                                {/* Test Header */}
                                <button
                                    onClick={() => toggleTest(test.testCaseNumber)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-800 hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center justify-between transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {test.passed ? (
                                            <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                                        ) : (
                                            <XCircle className="text-red-600 dark:text-red-400" size={20} />
                                        )}
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            Test Case {test.testCaseNumber}
                                        </span>
                                        <span className={`text-sm ${test.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {test.passed ? 'Passed' : 'Failed'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {test.executionTime && (
                                            <span className="text-xs text-gray-500">{test.executionTime}ms</span>
                                        )}
                                        {expandedTests.has(test.testCaseNumber) ? (
                                            <ChevronDown size={20} className="text-gray-500" />
                                        ) : (
                                            <ChevronRight size={20} className="text-gray-500" />
                                        )}
                                    </div>
                                </button>

                                {/* Test Details */}
                                {expandedTests.has(test.testCaseNumber) && (
                                    <div className="p-4 space-y-3 bg-white dark:bg-dark-900">
                                        {/* Input */}
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Input:</p>
                                            <pre className="text-sm bg-gray-50 dark:bg-dark-800 p-3 rounded border border-gray-200 dark:border-dark-700 font-mono overflow-x-auto">
                                                {test.input}
                                            </pre>
                                        </div>

                                        {/* Expected Output */}
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Expected Output:</p>
                                            <pre className="text-sm bg-gray-50 dark:bg-dark-800 p-3 rounded border border-gray-200 dark:border-dark-700 font-mono overflow-x-auto">
                                                {test.expectedOutput}
                                            </pre>
                                        </div>

                                        {/* Actual Output */}
                                        {test.actualOutput !== undefined && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Your Output:</p>
                                                <pre className={`text-sm p-3 rounded border font-mono overflow-x-auto ${test.passed
                                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100'
                                                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100'
                                                    }`}>
                                                    {test.actualOutput || '(empty)'}
                                                </pre>
                                            </div>
                                        )}

                                        {/* Error */}
                                        {test.error && (
                                            <div>
                                                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Error:</p>
                                                <pre className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 font-mono overflow-x-auto">
                                                    {test.error}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )
            }
        </div >
    );
};

export default TestResults;
