import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode2, Star } from 'lucide-react';
import { useProgramAdminStore } from '../../../store/programAdminStore';

const ProblemPreviewCard: React.FC = () => {
    const { problems, selectedProblem } = useProgramAdminStore();

    const problem = problems.find(p => p.id === selectedProblem);

    return (
        <AnimatePresence>
            {problem && (
                <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="overflow-hidden mt-4"
                >
                    <div className="p-5 rounded-xl border border-accent/20 bg-accent/5 flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent">
                                    <FileCode2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-text-primary">
                                        {problem.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${problem.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                                            problem.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {problem.difficulty}
                                        </span>
                                        <span className="flex items-center gap-1 text-[11px] font-medium text-text-secondary bg-gray-100 px-2 py-0.5 rounded">
                                            <Star className="w-3 h-3 text-accent fill-accent" />
                                            {problem.rating}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {problem.tags && problem.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                {problem.tags.slice(0, 4).map((tag, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-white border border-gray-100 rounded-md text-[10px] text-text-secondary">
                                        {tag}
                                    </span>
                                ))}
                                {problem.tags.length > 4 && (
                                    <span className="px-2 py-1 bg-white border border-gray-100 rounded-md text-[10px] text-text-tertiary">
                                        +{problem.tags.length - 4} more
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProblemPreviewCard;
