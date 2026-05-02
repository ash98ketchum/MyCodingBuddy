import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useProgramAdminStore } from '../../../store/programAdminStore';

import StudentSearchPanel from '../../../components/admin/program/StudentSearchPanel';
import ProblemSelectorPanel from '../../../components/admin/program/ProblemSelectorPanel';
import AssignmentActionBar from '../../../components/admin/program/AssignmentActionBar';

const AssignProblemPage: React.FC = () => {
    const { fetchInitialData, isFetchingInitial } = useProgramAdminStore();

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
    };

    return (
        <div className="min-h-screen bg-background p-4 sm:p-8 lg:p-12">
            <Helmet>
                <title>College Program Assignment | Admin Control Panel</title>
            </Helmet>

            <motion.div
                className="max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20 shadow-[0_0_15px_rgba(255,178,44,0.15)]">
                            <Briefcase className="w-6 h-6 text-accent" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
                            Program Assignment Center
                        </h1>
                    </div>
                    <p className="text-text-secondary max-w-2xl text-lg">
                        Securely dispatch coding challenges to verified college program students.
                        Validation is instantaneous to prevent bottlenecking.
                    </p>
                </motion.div>

                {isFetchingInitial ? (
                    <motion.div key="loading" variants={itemVariants} className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-accent animate-spin mb-4" />
                        <p className="text-text-tertiary">Optimizing Bloom filter and indexing problems...</p>
                    </motion.div>
                ) : (
                    <motion.div key="content" variants={containerVariants} className="h-full flex flex-col">
                        {/* Main Grid Workspace */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[500px]">
                            <motion.div variants={itemVariants} className="h-full">
                                <StudentSearchPanel />
                            </motion.div>

                            <motion.div variants={itemVariants} className="h-full">
                                <ProblemSelectorPanel />
                            </motion.div>
                        </div>

                        {/* Action Bar */}
                        <motion.div variants={itemVariants}>
                            <AssignmentActionBar />
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default AssignProblemPage;
