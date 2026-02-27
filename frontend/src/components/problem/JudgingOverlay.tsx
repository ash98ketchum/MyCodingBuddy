// frontend/src/components/problem/JudgingOverlay.tsx
//
// Full-screen animated overlay that covers Monaco while judging.
// Shows animated bars + spinner + status text.

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    visible: boolean;
    mode: 'running' | 'submitting';
}

export const JudgingOverlay: React.FC<Props> = ({ visible, mode }) => {
    const bars = [0.4, 0.7, 0.55, 0.85, 0.6, 0.75, 0.5, 0.65, 0.9, 0.45];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 z-20 bg-[#0F1115]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6"
                >
                    {/* Animated equaliser bars */}
                    <div className="flex items-end gap-1 h-12">
                        {bars.map((h, i) => (
                            <motion.div
                                key={i}
                                className="w-2 rounded-t"
                                style={{ backgroundColor: '#FFB22C', opacity: 0.8 }}
                                animate={{ scaleY: [h, 1, h * 0.6, 1, h] }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                    ease: 'easeInOut',
                                }}
                                initial={{ height: '100%', scaleY: h }}
                            />
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-[#FFB22C] font-bold text-lg tracking-wide">
                            {mode === 'submitting' ? 'Judging…' : 'Running…'}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            {mode === 'submitting' ? 'Running against all test cases' : 'Running sample tests'}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default JudgingOverlay;
