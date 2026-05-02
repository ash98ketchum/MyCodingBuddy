import React from 'react';
import { useCollegeDashboardStore } from '../../../store/collegeDashboardStore';
import { Users2 } from 'lucide-react';

export const CollegeStudentSegmentation: React.FC = () => {
    const { segmentation, isLoading } = useCollegeDashboardStore();

    if (isLoading || !segmentation) return null;

    const totalStudents = segmentation.segments.reduce((acc, s) => acc + s.value, 0);

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm col-span-1 border-t-4 border-t-blue-500">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                <Users2 className="w-5 h-5 text-blue-500" />
                Student Segmentation
            </h3>

            <div className="space-y-4">
                {segmentation.segments.map(segment => (
                    <div key={segment.name} className="flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                            <span className="text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                                {segment.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-900 font-bold">{segment.value}</span>
                            <span className="text-gray-400 text-xs w-8 text-right">
                                {totalStudents > 0 ? Math.round((segment.value / totalStudents) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Visual Progress Bar Distribution */}
            <div className="w-full h-3 rounded-full bg-gray-100 flex overflow-hidden mt-6">
                {segmentation.segments.map(segment => (
                    <div
                        key={segment.name}
                        className="h-full"
                        style={{
                            width: `${totalStudents > 0 ? (segment.value / totalStudents) * 100 : 0}%`,
                            backgroundColor: segment.color
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
