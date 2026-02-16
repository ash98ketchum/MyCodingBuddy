// frontend/src/pages/Resources/ApiDocsPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Server, Lock, Zap } from 'lucide-react';

const ApiDocsPage = () => {
    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container-custom max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-accent/10 rounded-xl text-accent">
                            <Server size={32} />
                        </div>
                        <h1 className="text-4xl font-bold">API Reference</h1>
                    </div>
                    <p className="text-text-secondary text-lg max-w-3xl">
                        Build powerful integrations with the CodingBuddy API. Access problems, submissions, and leaderboard data programmatically.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="font-semibold mb-2">Getting Started</div>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li className="text-accent font-medium">Introduction</li>
                            <li className="hover:text-text-primary cursor-pointer">Authentication</li>
                            <li className="hover:text-text-primary cursor-pointer">Rate Limits</li>
                            <li className="hover:text-text-primary cursor-pointer">Errors</li>
                        </ul>

                        <div className="font-semibold mb-2 mt-6">Endpoints</div>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li className="hover:text-text-primary cursor-pointer">Problems</li>
                            <li className="hover:text-text-primary cursor-pointer">Submissions</li>
                            <li className="hover:text-text-primary cursor-pointer">Users</li>
                            <li className="hover:text-text-primary cursor-pointer">Leaderboard</li>
                        </ul>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                            <p className="text-text-secondary mb-4">
                                The CodingBuddy API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
                            </p>
                            <div className="bg-card-bg border border-border rounded-xl p-4 font-mono text-sm">
                                https://api.codingbuddy.com/v1
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">Authentication</h2>
                            <p className="text-text-secondary mb-4">
                                Authenticate your API requests using your API key. You can manage your API keys in your account settings.
                            </p>
                            <div className="bg-card-bg border border-border rounded-xl p-6 font-mono text-sm overflow-x-auto">
                                <span className="text-purple-500">curl</span> https://api.codingbuddy.com/v1/user \<br />
                                &nbsp;&nbsp;<span className="text-blue-500">-H</span> <span className="text-green-500">"Authorization: Bearer YOUR_API_KEY"</span>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 border border-border rounded-xl bg-card-bg">
                                    <div className="text-2xl font-bold mb-1">60</div>
                                    <div className="text-sm text-text-secondary">reqs/min</div>
                                    <div className="text-xs text-text-secondary mt-2">Unauthenticated</div>
                                </div>
                                <div className="p-4 border border-border rounded-xl bg-card-bg">
                                    <div className="text-2xl font-bold text-accent mb-1">1000</div>
                                    <div className="text-sm text-text-secondary">reqs/min</div>
                                    <div className="text-xs text-text-secondary mt-2">Authenticated</div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiDocsPage;
