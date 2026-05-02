// frontend/src/components/problem/ProblemDescription.tsx
import React from 'react';
import { Clock, Database, Tag, BookOpen } from 'lucide-react';
import { Problem } from '@/types';

interface Props { problem: Problem; }

const DIFFICULTY_STYLES = {
    EASY: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    MEDIUM: 'text-amber-400  bg-amber-400/10  border-amber-400/30',
    HARD: 'text-rose-400   bg-rose-400/10   border-rose-400/30',
};

const ExampleBlock: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = 'text-gray-300' }) => (
    <div className="rounded-lg bg-[#1a1d23] border border-[#2B303B] overflow-hidden">
        <div className="px-3 py-1.5 border-b border-[#2B303B] bg-[#15181E]">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">{label}</span>
        </div>
        <pre className={`px-4 py-3 text-sm font-mono whitespace-pre-wrap leading-relaxed ${color}`}>{value}</pre>
    </div>
);

export const ProblemDescription: React.FC<Props> = ({ problem }) => {
    const acceptanceRate = problem.submissionCount > 0
        ? ((problem.acceptedCount / problem.submissionCount) * 100).toFixed(1)
        : '0.0';

    return (
        <div className="space-y-6 pb-10">
            {/* Title + Badges */}
            <div>
                <h1 className="text-xl font-bold text-white mb-3 leading-tight">{problem.title}</h1>
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${DIFFICULTY_STYLES[problem.difficulty]}`}>
                        {problem.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">Acceptance: <span className="text-gray-300">{acceptanceRate}%</span></span>
                    <span className="text-xs text-gray-500">{problem.submissionCount.toLocaleString()} submissions</span>
                </div>
            </div>

            {/* Tags */}
            {problem.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-[#1E2229] border border-[#2B303B] rounded-full text-xs text-gray-400">
                            <Tag size={10} />
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Description */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={15} className="text-gray-500" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Problem</span>
                </div>
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{problem.description}</div>
            </div>

            {/* Example */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Example</p>
                <div className="space-y-2">
                    <ExampleBlock label="Input" value={problem.sampleInput} />
                    <ExampleBlock label="Output" value={problem.sampleOutput} color="text-emerald-300" />
                </div>
            </div>

            {/* Explanation */}
            {problem.explanation && (
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Explanation</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{problem.explanation}</p>
                </div>
            )}

            {/* Constraints */}
            {problem.constraints && (
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Constraints</p>
                    <div className="bg-[#1a1d23] border border-[#2B303B] rounded-lg px-4 py-3">
                        <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">{problem.constraints}</pre>
                    </div>
                </div>
            )}

            {/* Meta */}
            <div className="flex items-center gap-5 pt-2 border-t border-[#2B303B]">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock size={13} />Time Limit: <span className="text-gray-300">{problem.timeLimit}ms</span>
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Database size={13} />Memory: <span className="text-gray-300">{problem.memoryLimit}MB</span>
                </span>
            </div>
        </div>
    );
};

export default ProblemDescription;
