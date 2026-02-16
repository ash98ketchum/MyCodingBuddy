// frontend/src/pages/Legal/TermsPage.tsx
import React from 'react';
import { motion } from 'framer-motion';

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container-custom max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="lead">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>

                        <h3>1. Acceptance of Terms</h3>
                        <p>
                            By accessing and using CodingBuddy ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement.
                        </p>

                        <h3>2. Description of Service</h3>
                        <p>
                            CodingBuddy provides an online platform for competitive programming, coding practice, and community discussion. We reserve the right to modify, suspend, or discontinue the service at any time.
                        </p>

                        <h3>3. User Accounts</h3>
                        <p>
                            You are responsible for maintaining the security of your account and password. CodingBuddy cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
                        </p>

                        <h3>4. User Content</h3>
                        <p>
                            You retain all rights to any code, text, or other content you submit to the Platform. By submitting content, you grant CodingBuddy a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content in connection with the Service.
                        </p>

                        <h3>5. Code of Conduct</h3>
                        <p>
                            You agree specifically not to:
                            <ul>
                                <li>Use the service for any illegal purpose</li>
                                <li>Submit malicious code or attempt to exploit the platform</li>
                                <li>Harass, abuse, or harm other users</li>
                                <li>Share solutions during active contests</li>
                            </ul>
                        </p>

                        <h3>6. Termination</h3>
                        <p>
                            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsPage;
