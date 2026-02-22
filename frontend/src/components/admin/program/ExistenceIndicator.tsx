import React from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type IndicatorState = 'idle' | 'checking' | 'exists' | 'not_found';

interface ExistenceIndicatorProps {
    state: IndicatorState;
}

const ExistenceIndicator: React.FC<ExistenceIndicatorProps> = ({ state }) => {
    return (
        <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-gray-100 bg-gray-50 absolute right-3 top-1/2 -translate-y-1/2 shadow-sm w-10 h-10 overflow-hidden">
            <AnimatePresence mode="wait">
                {state === 'idle' && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="w-2.5 h-2.5 rounded-full bg-gray-300"
                    />
                )}
                {state === 'checking' && (
                    <motion.div
                        key="checking"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        className="flex items-center justify-center text-accent"
                    >
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </motion.div>
                )}
                {state === 'exists' && (
                    <motion.div
                        key="exists"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="text-emerald-500"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                    </motion.div>
                )}
                {state === 'not_found' && (
                    <motion.div
                        key="not_found"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="text-rose-500"
                    >
                        <XCircle className="w-5 h-5" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExistenceIndicator;
