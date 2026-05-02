import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCollegeDashboardStore } from '../../../store/collegeDashboardStore';
import { CollegeOverviewCards } from '../../../components/admin/college/CollegeOverviewCards';
import { CollegePerformanceCharts } from '../../../components/admin/college/CollegePerformanceCharts';
import { CollegeIntegrityPanel } from '../../../components/admin/college/CollegeIntegrityPanel';
import { CollegeStudentSegmentation } from '../../../components/admin/college/CollegeStudentSegmentation';
import { CollegeProblemAnalytics } from '../../../components/admin/college/CollegeProblemAnalytics';
import { CollegeLeaderboardTable } from '../../../components/admin/college/CollegeLeaderboardTable';
import { CollegeInvitationsList } from '../../../components/admin/college/CollegeInvitationsList';
import { Download, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CollegeDashboardPage: React.FC = () => {
    const { collegeId } = useParams<{ collegeId: string }>();
    const { fetchAll, isLoading, error } = useCollegeDashboardStore();

    useEffect(() => {
        if (collegeId) {
            fetchAll(collegeId);
        }
    }, [collegeId, fetchAll]);

    const handleExport = () => {
        // Future implement Excel export
        alert('Exporting to Excel (Coming Soon)');
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load analytics</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                    onClick={() => collegeId && fetchAll(collegeId)}
                    className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors"
                >
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50"
        >
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">College Analytics Insights</h1>
                    <p className="text-gray-500 mt-1">Deep performance tracking for ID: {collegeId}</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => collegeId && fetchAll(collegeId)}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-accent' : ''}`} />
                        Refresh Data
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium shadow-sm shadow-gray-900/20"
                    >
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <CollegeOverviewCards />

            <CollegePerformanceCharts />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CollegeIntegrityPanel />
                <CollegeStudentSegmentation />
            </div>

            <CollegeProblemAnalytics />

            <CollegeLeaderboardTable />

            {/* Student Invitations Panel */}
            {collegeId && <CollegeInvitationsList collegeId={collegeId} />}

        </motion.div>
    );
};

export default CollegeDashboardPage;
