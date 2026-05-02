import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, Target, ShieldCheck, Activity } from 'lucide-react';
import { useCollegeDashboardStore } from '../../../store/collegeDashboardStore';

export const CollegeOverviewCards: React.FC = () => {
    const { overview, isLoading } = useCollegeDashboardStore();

    if (isLoading || !overview) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="animate-pulse bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-32" />
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: 'Total Students',
            value: overview.totalStudents,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            title: 'Active Today',
            value: overview.activeToday,
            icon: Activity,
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            title: 'Solved Today',
            value: overview.solvedToday,
            icon: CheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            title: 'Avg Solve Rate',
            value: `${overview.avgSolveRate}%`,
            icon: Target,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
        {
            title: 'Integrity Score',
            value: `${overview.integrityScore}%`,
            icon: ShieldCheck,
            color: overview.integrityScore < 80 ? 'text-red-500' : 'text-accent',
            bg: overview.integrityScore < 80 ? 'bg-red-50' : 'bg-accent/10'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            {cards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${card.bg}`}>
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                    </div>
                    {/* Decorative Background */}
                    <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${card.bg} opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-500`} />
                </motion.div>
            ))}
        </div>
    );
};
