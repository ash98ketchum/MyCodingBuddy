// frontend/src/pages/Legal/LicensePage.tsx
import React from 'react';
import { motion } from 'framer-motion';

const LicensePage = () => {
    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container-custom max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold mb-8">License</h1>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p>
                            The content on CodingBuddy, including problem descriptions and test cases, is licensed under specific terms.
                        </p>

                        <h3>Platform Code</h3>
                        <p>
                            The CodingBuddy platform source code is proprietary and confidential. You may not copy, modify, distribute, or sell any part of our platform without explicit permission.
                        </p>

                        <h3>User Content</h3>
                        <p>
                            Code submitted by users remains the property of the user. However, by submitting code to public problems or discussions, you grant CodingBuddy and other users a license to view and learn from your code.
                        </p>

                        <h3>Open Source Components</h3>
                        <p>
                            CodingBuddy uses several open source libraries and components. Each of these is used in accordance with its respective license.
                            <ul>
                                <li>React - MIT License</li>
                                <li>Vite - MIT License</li>
                                <li>Tailwind CSS - MIT License</li>
                                <li>Monaco Editor - MIT License</li>
                            </ul>
                        </p>

                        <h3>Content License</h3>
                        <p>
                            Unless otherwise noted, educational content and problem descriptions on this site are licensed under a <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LicensePage;
