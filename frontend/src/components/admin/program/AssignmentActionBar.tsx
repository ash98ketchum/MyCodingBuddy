import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useProgramAdminStore } from '../../../store/programAdminStore';

const AssignmentActionBar: React.FC = () => {
    const {
        selectedStudent,
        selectedProblem,
        assignProblem,
        isAssigning,
        assignSuccess
    } = useProgramAdminStore();

    const [errorShake, setErrorShake] = useState(false);

    const isReady = !!selectedStudent && !!selectedProblem;

    const handleAssign = async () => {
        if (!isReady) {
            setErrorShake(true);
            setTimeout(() => setErrorShake(false), 500);
            return;
        }
        await assignProblem();
    };

    return (
        <div className="card p-6 mt-6 bg-white dark:bg-dark-900 border-t-4 border-t-indigo-500 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
            {/* Background embellishment */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex-1 relative z-10 w-full">
                <h3 className="text-lg font-bold text-text-primary mb-1">
                    Ready to Dispatch
                </h3>
                <p className="text-sm text-text-secondary">
                    {isReady
                        ? "Both student and problem are selected. The daily assignment will be queued instantly."
                        : "Please select a valid student and a problem to proceed."}
                </p>

                {/* Missing required data indicator */}
                <AnimatePresence>
                    {!isReady && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 flex items-center gap-4 text-xs font-medium"
                        >
                            <span className={`flex items-center gap-1.5 ${selectedStudent ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {selectedStudent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                Student Verified
                            </span>
                            <span className={`flex items-center gap-1.5 ${selectedProblem ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {selectedProblem ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                Problem Selected
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.div
                className="w-full sm:w-auto relative z-10"
                animate={errorShake ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
            >
                <button
                    onClick={handleAssign}
                    disabled={!isReady || isAssigning || assignSuccess}
                    className={`w-full sm:w-48 relative overflow-hidden h-12 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-md
                        ${isReady && !assignSuccess
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-500/20'
                            : 'bg-gray-100 dark:bg-dark-800 text-gray-400 cursor-not-allowed border border-gray-200 dark:border-dark-700'
                        }
                    `}
                >
                    <AnimatePresence mode="wait">
                        {isAssigning ? (
                            <motion.div
                                key="assigning"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2"
                            >
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Assigning...
                            </motion.div>
                        ) : assignSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 text-emerald-500"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                Dispatched!
                            </motion.div>
                        ) : (
                            <motion.div
                                key="initial"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 group"
                            >
                                <Send className={`w-5 h-5 ${isReady ? 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform' : ''}`} />
                                Assign Problem
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </motion.div>
        </div>
    );
};

export default AssignmentActionBar;
