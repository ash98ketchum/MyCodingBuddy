import React from 'react';
import { useCollegeDashboardStore } from '../../../store/collegeDashboardStore';
import { Trophy, Medal, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export const CollegeLeaderboardTable: React.FC = () => {
    const { leaderboard, isLoading } = useCollegeDashboardStore();

    if (isLoading || !leaderboard) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse h-96" />
        );
    }

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Trophy className="w-5 h-5 text-yellow-500" />;
            case 1: return <Medal className="w-5 h-5 text-gray-400" />;
            case 2: return <Award className="w-5 h-5 text-amber-700" />;
            default: return <span className="w-5 h-5 text-center font-bold text-gray-400">{index + 1}</span>;
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm col-span-1 lg:col-span-3 mb-8">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-yellow-500" />
                College Top Performers
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 text-sm font-semibold text-gray-500 bg-gray-50 uppercase tracking-wider">
                            <th className="py-4 px-4 rounded-tl-xl">Rank</th>
                            <th className="py-4 px-4">Student</th>
                            <th className="py-4 px-4">Email</th>
                            <th className="py-4 px-4 text-center">Problems Solved</th>
                            <th className="py-4 px-4 text-right rounded-tr-xl">Total Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((student, index) => (
                            <motion.tr
                                key={student.studentId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${index < 3 ? 'bg-amber-50/30' : ''}`}
                            >
                                <td className="py-4 px-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100">
                                        {getRankIcon(index)}
                                    </div>
                                </td>
                                <td className="py-4 px-4 font-bold text-gray-900">{student.name}</td>
                                <td className="py-4 px-4 text-gray-500 text-sm">{student.email}</td>
                                <td className="py-4 px-4 text-center font-medium text-emerald-600">
                                    {student.problemsSolved}
                                </td>
                                <td className="py-4 px-4 text-right font-bold text-accent">
                                    {student.score} pts
                                </td>
                            </motion.tr>
                        ))}
                        {leaderboard.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                    No students have solved any assignments yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
