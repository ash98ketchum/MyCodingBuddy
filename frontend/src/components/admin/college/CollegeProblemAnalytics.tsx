import React from 'react';
import { useCollegeDashboardStore } from '../../../store/collegeDashboardStore';
import { Target, TrendingDown } from 'lucide-react';

export const CollegeProblemAnalytics: React.FC = () => {
    const { problems, isLoading } = useCollegeDashboardStore();

    if (isLoading || !problems) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-emerald-500" />
                    Most Solved Problems
                </h3>
                <div className="space-y-3">
                    {problems.mostSolved.map((p, idx) => (
                        <div key={p.problemId} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                                    {idx + 1}
                                </span>
                                <span className="font-medium text-gray-700 truncate w-40">{p.problemId}</span>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <span className="text-gray-500 text-xs">AC: <b className="text-gray-900 text-sm">{p.solves}</b></span>
                                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-xs">{p.solveRate}% Rate</span>
                            </div>
                        </div>
                    ))}
                    {problems.mostSolved.length === 0 && (
                        <div className="text-center text-gray-500 py-4 text-sm bg-gray-50 rounded-xl">No analytics available yet</div>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                    Highest Failure Rate
                </h3>
                <div className="space-y-3">
                    {problems.leastSolved.map((p, idx) => (
                        <div key={p.problemId} className="flex items-center justify-between p-3 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center">
                                    {idx + 1}
                                </span>
                                <span className="font-medium text-gray-700 truncate w-40">{p.problemId}</span>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <span className="text-gray-500 text-xs">Fails: <b className="text-gray-900 text-sm">{p.attempts - p.solves}</b></span>
                                <span className="text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded-md text-xs">{100 - p.solveRate}% Rate</span>
                            </div>
                        </div>
                    ))}
                    {problems.leastSolved.length === 0 && (
                        <div className="text-center text-gray-500 py-4 text-sm bg-gray-50 rounded-xl">No analytics available yet</div>
                    )}
                </div>
            </div>
        </div>
    );
};
