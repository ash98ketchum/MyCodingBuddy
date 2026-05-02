import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useCollegeDashboardStore } from '../../../store/collegeDashboardStore';
import { ShieldAlert, Fingerprint } from 'lucide-react';

export const CollegeIntegrityPanel: React.FC = () => {
    const { integrity, isLoading } = useCollegeDashboardStore();

    if (isLoading || !integrity) return null;

    const data = [
        { name: 'Honest', value: integrity.honestRatio, color: '#10B981' }, // Green
        { name: 'Suspicious', value: integrity.suspiciousRatio, color: '#EF4444' } // Red
    ];

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm col-span-1 border-t-4 border-t-red-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <ShieldAlert className="w-48 h-48" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                <Fingerprint className="w-5 h-5 text-red-500" />
                Integrity Distribution
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="h-48 w-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold text-gray-900">{integrity.honestRatio}%</span>
                        <span className="text-xs text-gray-500 font-medium">Honest</span>
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    {integrity.flagsByType.map(flag => (
                        <div key={flag.type} className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                            <span className="text-red-700 font-medium text-sm">{flag.type}</span>
                            <span className="text-red-900 font-bold bg-white px-2 py-1 rounded-md text-sm">
                                {flag.count} Events
                            </span>
                        </div>
                    ))}
                    {integrity.flagsByType.length === 0 && (
                        <div className="text-center text-gray-500 text-sm py-4 bg-gray-50 rounded-xl">
                            No suspicious flags detected today.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
