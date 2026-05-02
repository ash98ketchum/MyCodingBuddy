import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCollegeDashboardStore } from '../../../store/collegeDashboardStore';
import { Activity, Clock, RotateCcw } from 'lucide-react';

export const CollegePerformanceCharts: React.FC = () => {
    const { performance, isLoading } = useCollegeDashboardStore();

    if (isLoading || !performance) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[400px] animate-pulse mb-8" />
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-accent" />
                        7-Day Solve Rate Curve
                    </h3>
                </div>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performance.solveRateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="solved"
                                stroke="#f59e0b"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorSolved)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <Clock className="w-8 h-8 text-blue-400 mb-4" />
                    <h4 className="text-gray-400 font-medium mb-1">Avg Execution Time</h4>
                    <p className="text-3xl font-bold">{performance.avgExecutionTime}ms</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
                    <RotateCcw className="w-8 h-8 text-accent mb-4" />
                    <h4 className="text-gray-500 font-medium mb-1">Avg Attempts / AC</h4>
                    <p className="text-3xl font-bold text-gray-900">{performance.avgAttempts}</p>
                </div>
            </div>
        </div>
    );
};
