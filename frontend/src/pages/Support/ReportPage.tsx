// frontend/src/pages/Support/ReportPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bug, AlertTriangle, CheckCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

const ReportPage = () => {
    const [loading, setLoading] = useState(false);
    const [severity, setSeverity] = useState('low');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        steps: '',
        environment: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Bug report submitted successfully! Thank you for helping us improve.');
        setFormData({ title: '', description: '', steps: '', environment: '' });
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container-custom max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                            <Bug size={32} />
                        </div>
                        <h1 className="text-4xl font-bold">Report a Bug</h1>
                    </div>
                    <p className="text-text-secondary">
                        Found an issue? Please help us fix it by providing as much detail as possible.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Issue Title</label>
                            <input
                                type="text"
                                required
                                placeholder="E.g., Submission fails with 500 error"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-accent focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Severity</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['low', 'medium', 'high'].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setSeverity(level)}
                                        className={`p-3 rounded-lg border capitalize transition-all ${severity === level
                                                ? 'border-accent bg-accent/10 text-accent font-semibold'
                                                : 'border-input hover:bg-gray-50 dark:hover:bg-dark-800'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Describe what happened..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-accent focus:outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Steps to Reproduce</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="1. Go to page...&#10;2. Click button...&#10;3. Observe error..."
                                value={formData.steps}
                                onChange={e => setFormData({ ...formData, steps: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-accent focus:outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Environment (Browser/OS)</label>
                            <input
                                type="text"
                                placeholder="Chrome 120 on Windows 11"
                                value={formData.environment}
                                onChange={e => setFormData({ ...formData, environment: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-accent focus:outline-none"
                            />
                        </div>

                        <div className="pt-4 border-t border-border">
                            <Button
                                loading={loading}
                                type="submit"
                                variant="primary"
                                className="w-full"
                                icon={<AlertTriangle size={18} />}
                            >
                                Submit Report
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ReportPage;
