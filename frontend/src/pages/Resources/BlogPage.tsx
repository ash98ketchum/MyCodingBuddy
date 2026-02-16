// frontend/src/pages/Resources/BlogPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';

const BlogPage = () => {
    const posts = [
        {
            title: "The Future of Competitive Programming",
            excerpt: "Exploring how AI and new technologies are shaping the landscape of algorithmic challenges.",
            date: "Feb 15, 2026",
            author: "Sarah Chen",
            image: "https://images.unsplash.com/photo-1485827404703-89f55137bdbe?auto=format&fit=crop&q=80&w=400"
        },
        {
            title: "Introducing CodingBuddy Pro",
            excerpt: "Unlock premium features, advanced analytics, and exclusive problem sets with our new subscription tier.",
            date: "Feb 10, 2026",
            author: "Alex Rivera",
            image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=400"
        },
        {
            title: "Top 10 Algorithms for Technical Interviews",
            excerpt: "A comprehensive guide to the most essential algorithms you need to know for FAANG interviews.",
            date: "Feb 05, 2026",
            author: "Michael Chang",
            image: "https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&q=80&w=400"
        }
    ];

    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container-custom max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold mb-4">Blog</h1>
                    <p className="text-text-secondary">
                        Updates, news, and insights from the CodingBuddy team.
                    </p>
                </motion.div>

                <div className="space-y-12">
                    {posts.map((post, index) => (
                        <motion.article
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col md:flex-row gap-8 items-start group cursor-pointer"
                        >
                            <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden shrink-0">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User size={14} />
                                        <span>{post.author}</span>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-text-secondary leading-relaxed mb-4">
                                    {post.excerpt}
                                </p>
                                <span className="text-accent text-sm font-medium group-hover:underline">
                                    Read more →
                                </span>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
