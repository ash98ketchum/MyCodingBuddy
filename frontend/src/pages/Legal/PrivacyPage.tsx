// frontend/src/pages/Legal/PrivacyPage.tsx
import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container-custom max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="lead">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>

                        <h3>1. Information We Collect</h3>
                        <p>
                            We collect information you provide directly to us, such as when you create an account, update your profile, or submit code. This includes:
                            <ul>
                                <li>Username and email address</li>
                                <li>Profile information (avatar, bio)</li>
                                <li>Code submissions and problem solutions</li>
                                <li>Discussion posts and comments</li>
                            </ul>
                        </p>

                        <h3>2. How We Use Information</h3>
                        <p>
                            We use the information we collect to:
                            <ul>
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process your code submissions</li>
                                <li>Generate leaderboard rankings and statistics</li>
                                <li>Send you technical notices and support messages</li>
                            </ul>
                        </p>

                        <h3>3. Code Submissions</h3>
                        <p>
                            Your public code submissions may be visible to other users. Please do not include sensitive personal information, keys, or secrets in your code.
                        </p>

                        <h3>4. Cookies</h3>
                        <p>
                            We use cookies to maintain your session and preferences. You can control cookies through your browser settings.
                        </p>

                        <h3>5. Data Security</h3>
                        <p>
                            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPage;
