// frontend/src/pages/Resources/DocsPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Book, Code, Terminal, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const DocsPage = () => {
    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container-custom max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold mb-4">Documentation</h1>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Everything you need to know about using CodingBuddy, from getting started to advanced platform features.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Getting Started */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card p-8 hover:border-accent transition-colors"
                    >
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
                            <Book size={24} />
                        </div>
                        <h2 className="text-xl font-bold mb-4">Getting Started</h2>
                        <ul className="space-y-3 text-text-secondary">
                            <li><Link to="#" className="hover:text-accent">Platform Overview</Link></li>
                            <li><Link to="#" className="hover:text-accent">Creating an Account</Link></li>
                            <li><Link to="#" className="hover:text-accent">Solving Your First Problem</Link></li>
                            <li><Link to="#" className="hover:text-accent">Understanding the Interface</Link></li>
                        </ul>
                    </motion.div>

                    {/* Problem Solving */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card p-8 hover:border-accent transition-colors"
                    >
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6">
                            <Code size={24} />
                        </div>
                        <h2 className="text-xl font-bold mb-4">Problem Solving</h2>
                        <ul className="space-y-3 text-text-secondary">
                            <li><Link to="#" className="hover:text-accent">Supported Languages</Link></li>
                            <li><Link to="#" className="hover:text-accent">Input/Output Format</Link></li>
                            <li><Link to="#" className="hover:text-accent">Time & Memory Limits</Link></li>
                            <li><Link to="#" className="hover:text-accent">Debugging Tips</Link></li>
                        </ul>
                    </motion.div>

                    {/* Advanced Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card p-8 hover:border-accent transition-colors"
                    >
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6">
                            <Terminal size={24} />
                        </div>
                        <h2 className="text-xl font-bold mb-4">Advanced Features</h2>
                        <ul className="space-y-3 text-text-secondary">
                            <li><Link to="#" className="hover:text-accent">Custom Test Cases</Link></li>
                            <li><Link to="#" className="hover:text-accent">Keyboard Shortcuts</Link></li>
                            <li><Link to="#" className="hover:text-accent">Vim/Emacs Mode</Link></li>
                            <li><Link to="#" className="hover:text-accent">API Access</Link></li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DocsPage;
