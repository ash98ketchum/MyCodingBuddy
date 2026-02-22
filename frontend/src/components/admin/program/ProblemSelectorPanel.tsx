import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgramAdminStore } from '../../../store/programAdminStore';
import ProblemPreviewCard from './ProblemPreviewCard';

const ProblemSelectorPanel: React.FC = () => {
    const { problems, selectedProblem, setSelectedProblem } = useProgramAdminStore();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProblems = useMemo(() => {
        if (!searchTerm) return problems;
        const lower = searchTerm.toLowerCase();
        return problems.filter(p =>
            p.title.toLowerCase().includes(lower) ||
            p.tags.some(t => t.toLowerCase().includes(lower))
        );
    }, [problems, searchTerm]);

    const handleSelect = (id: string | null) => {
        setSelectedProblem(id);
        setIsOpen(false);
        setSearchTerm('');
    };

    const activeProblem = problems.find(p => p.id === selectedProblem);

    return (
        <div className="card p-6 border-l-4 border-l-secondary flex flex-col h-full bg-white shadow-md">
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1 flex items-center gap-2">
                    <Search className="w-5 h-5 text-secondary" />
                    Problem Selection
                </h3>
                <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                    Choose the specific challenge to assign to the verified student.
                </p>
            </div>

            <div className="relative group flex-1 flex flex-col">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block ml-1">
                    Select Challenge
                </label>

                {/* Custom Select Trigger */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full input text-left shadow-sm flex items-center justify-between bg-white focus:ring-secondary/20 focus:border-secondary transition-all"
                    >
                        <span className={`block truncate ${!activeProblem ? 'text-gray-400' : 'text-text-primary font-medium'}`}>
                            {activeProblem ? activeProblem.title : 'Search and select a problem...'}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-72 flex flex-col overflow-hidden"
                            >
                                <div className="p-2 border-b border-gray-100">
                                    <input
                                        type="text"
                                        placeholder="Search by title or tag..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                                    />
                                </div>

                                <ul className="overflow-y-auto flex-1 p-1">
                                    {filteredProblems.length === 0 ? (
                                        <li className="p-4 text-center text-sm text-text-tertiary">
                                            No problems found.
                                        </li>
                                    ) : (
                                        filteredProblems.map((p) => (
                                            <li
                                                key={p.id}
                                                onClick={() => handleSelect(p.id)}
                                                className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${selectedProblem === p.id
                                                    ? 'bg-secondary/10'
                                                    : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-medium ${selectedProblem === p.id ? 'text-secondary' : 'text-text-primary'}`}>
                                                        {p.title}
                                                    </span>
                                                    <span className="text-xs text-text-tertiary mt-0.5 max-w-[200px] truncate">
                                                        {p.difficulty} • {p.tags.slice(0, 2).join(', ')}
                                                    </span>
                                                </div>
                                                {selectedProblem === p.id && (
                                                    <Check className="w-4 h-4 text-secondary" />
                                                )}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Cover interaction when dropdown open to close it on click outside */}
                {isOpen && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                )}

                <ProblemPreviewCard />
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-text-tertiary font-medium">
                <span>Available Library:</span>
                <span>{problems.length} problems fetched</span>
            </div>
        </div>
    );
};

export default ProblemSelectorPanel;
