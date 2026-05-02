import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CheckCircle2 } from 'lucide-react';
import { useProgramAdminStore } from '../../../store/programAdminStore';

const StudentPreviewCard: React.FC = () => {
    const { selectedStudent } = useProgramAdminStore();

    return (
        <AnimatePresence>
            {selectedStudent && (
                <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="overflow-hidden mt-4"
                >
                    <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/50 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <User className="text-emerald-600 w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-text-primary truncate">
                                {selectedStudent.name}
                            </h4>
                            <p className="text-xs text-text-secondary truncate">
                                {selectedStudent.email}
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StudentPreviewCard;
