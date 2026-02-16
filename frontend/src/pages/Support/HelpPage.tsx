// frontend/src/pages/Support/HelpPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui';

const HelpPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "How do I start solving problems?",
            answer: "Navigate to the Problems page, browse through the list, and click on any problem that interests you. You'll see the problem description and a code editor where you can write and submit your solution."
        },
        {
            question: "What programming languages are supported?",
            answer: "We currently support JavaScript, Python, C++, and Java. We're constantly working on adding support for more languages."
        },
        {
            question: "How is the leaderboard calculated?",
            answer: "The leaderboard is based on your total score. You earn points by solving problems - harder problems award more points. We also track your streak and solved count."
        },
        {
            question: "Can I discuss solutions with others?",
            answer: "Yes! Each problem has a discussion section where you can share your approach, ask questions, and learn from other users' solutions."
        },
        {
            question: "How do I report a bug?",
            answer: "You can report bugs using the 'Report Bug' link in the footer. Please provide as much detail as possible to help us reproduce and fix the issue."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container-custom max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">Help Center</h1>
                    <p className="text-text-secondary mb-8">
                        Find answers to common questions and learn how to use CodingBuddy.
                    </p>

                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                        <input
                            type="text"
                            placeholder="Search for help..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-accent focus:outline-none"
                        />
                    </div>
                </motion.div>

                <div className="space-y-4">
                    {filteredFaqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-card-bg border border-border rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-accent/5 transition-colors"
                            >
                                <span className="font-semibold text-lg">{faq.question}</span>
                                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-6 text-text-secondary">
                                    {faq.answer}
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {filteredFaqs.length === 0 && (
                        <div className="text-center py-12 text-text-secondary">
                            No results found for "{searchQuery}"
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
