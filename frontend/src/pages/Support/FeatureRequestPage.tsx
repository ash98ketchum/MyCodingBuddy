// frontend/src/pages/Support/FeatureRequestPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ThumbsUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

const FeatureRequestPage = () => {
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Feature request submitted! Thanks for the idea.');
        setRequest('');
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container-custom max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block p-4 rounded-full bg-yellow-500/10 text-yellow-500 mb-6">
                        <Lightbulb size={40} />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Feature Requests</h1>
                    <p className="text-text-secondary">
                        Help us shape the future of CodingBuddy. What should we build next?
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-8 mb-12"
                >
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <input
                            type="text"
                            required
                            placeholder="I wish CodingBuddy had..."
                            value={request}
                            onChange={e => setRequest(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-accent focus:outline-none"
                        />
                        <Button
                            loading={loading}
                            type="submit"
                            variant="primary"
                            icon={<Plus size={18} />}
                        >
                            Suggest
                        </Button>
                    </form>
                </motion.div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg mb-6">Popular Requests</h3>
                    {[
                        { title: "Dark mode for code editor", votes: 156 },
                        { title: "Mobile app for iOS and Android", votes: 142 },
                        { title: "Weekly coding contests", votes: 98 },
                        { title: "Integration with GitHub", votes: 87 }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + (index * 0.1) }}
                            className="card p-4 flex items-center justify-between group hover:border-accent transition-colors cursor-pointer"
                        >
                            <span className="font-medium">{item.title}</span>
                            <div className="flex items-center gap-2 text-text-secondary group-hover:text-accent">
                                <ThumbsUp size={16} />
                                <span>{item.votes}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeatureRequestPage;
