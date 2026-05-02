// frontend/src/pages/Resources/TutorialsPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, BarChart } from 'lucide-react';

const TutorialsPage = () => {
    const tutorials = [
        {
            title: "Dynamic Programming Guide",
            description: "Master the art of breaking down problems into smaller subproblems.",
            level: "Advanced",
            duration: "45 min",
            image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=400",
            category: "Algorithms"
        },
        {
            title: "Graph Theory Basics",
            description: "Learn about BFS, DFS, and shortest path algorithms.",
            level: "Intermediate",
            duration: "30 min",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
            category: "Data Structures"
        },
        {
            title: "Time Complexity Analysis",
            description: "Understand Big O notation and how to analyze your code's performance.",
            level: "Beginner",
            duration: "20 min",
            image: "https://images.unsplash.com/photo-1509228627129-6690a87531bc?auto=format&fit=crop&q=80&w=400",
            category: "Fundamentals"
        },
        {
            title: "Bit Manipulation Tricks",
            description: "Essential bitwise operations for competitive programming.",
            level: "Intermediate",
            duration: "25 min",
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400",
            category: "Algorithms"
        }
    ];

    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container-custom max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold mb-4">Tutorials</h1>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Deep dive into algorithms, data structures, and problem-solving strategies.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tutorials.map((tutorial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card overflow-hidden group hover:border-accent transition-all cursor-pointer"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={tutorial.image}
                                    alt={tutorial.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs backdrop-blur-sm">
                                    {tutorial.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-xl mb-2 group-hover:text-accent transition-colors">
                                    {tutorial.title}
                                </h3>
                                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                                    {tutorial.description}
                                </p>
                                <div className="flex items-center justify-between text-xs text-text-secondary">
                                    <div className="flex items-center gap-1">
                                        <BarChart size={14} />
                                        <span>{tutorial.level}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>{tutorial.duration}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TutorialsPage;
