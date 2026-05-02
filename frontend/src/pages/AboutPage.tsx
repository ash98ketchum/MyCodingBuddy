// frontend/src/pages/AboutPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Users, Rocket, Heart } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container-custom max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text inline-block">
                        About CodingBuddy
                    </h1>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                        Empowering the next generation of developers with the tools, community, and knowledge to succeed.
                    </p>
                </motion.div>

                {/* Mission Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20"
                >
                    <div>
                        <div className="p-4 rounded-2xl bg-accent/10 w-fit mb-6">
                            <Rocket className="text-accent" size={40} />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <p className="text-text-secondary leading-relaxed mb-6">
                            We believe that coding is the most important skill of the 21st century. Our mission is to make learning to code accessible, engaging, and effective for everyone, regardless of their background or experience level.
                        </p>
                        <p className="text-text-secondary leading-relaxed">
                            Through competitive programming, we provide a structured path to mastery, helping developers build problem-solving skills that are essential in the modern tech industry.
                        </p>
                    </div>
                    <div className="bg-card-bg border border-border rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="p-4 bg-background rounded-xl border border-border">
                                    <h4 className="font-bold text-2xl text-accent mb-1">500+</h4>
                                    <p className="text-sm text-text-secondary">Problems</p>
                                </div>
                                <div className="p-4 bg-background rounded-xl border border-border">
                                    <h4 className="font-bold text-2xl text-secondary mb-1">50k+</h4>
                                    <p className="text-sm text-text-secondary">Submissions</p>
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="p-4 bg-background rounded-xl border border-border">
                                    <h4 className="font-bold text-2xl text-success mb-1">10k+</h4>
                                    <p className="text-sm text-text-secondary">Users</p>
                                </div>
                                <div className="p-4 bg-background rounded-xl border border-border">
                                    <h4 className="font-bold text-2xl text-blue-500 mb-1">99%</h4>
                                    <p className="text-sm text-text-secondary">Uptime</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Values Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-20"
                >
                    <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card p-8">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
                                <Code2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Excellence</h3>
                            <p className="text-text-secondary">
                                We strive for excellence in everything we do, from the quality of our problems to the performance of our platform.
                            </p>
                        </div>
                        <div className="card p-8">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Community</h3>
                            <p className="text-text-secondary">
                                We believe in the power of community. Learning together is faster, more fun, and more effective than learning alone.
                            </p>
                        </div>
                        <div className="card p-8">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6">
                                <Heart size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Keep it simple</h3>
                            <p className="text-text-secondary">
                                We focus on what matters most: clean code, clear explanations, and user-friendly design.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Team Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-3xl font-bold text-center mb-12">Meet the Team</h2>
                    <div className="text-center text-text-secondary">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4"
                            alt="Team"
                            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-accent/20"
                        />
                        <h3 className="text-xl font-bold text-text-primary">The CodingBuddy Team</h3>
                        <p className="mt-2">Built with passion by developers, for developers.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;
