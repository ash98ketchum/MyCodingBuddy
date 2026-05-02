// frontend/src/pages/Legal/CodeOfConductPage.tsx
import React from 'react';
import { motion } from 'framer-motion';

const CodeOfConductPage = () => {
    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container-custom max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold mb-8">Code of Conduct</h1>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <h3>Our Pledge</h3>
                        <p>
                            In the interest of fostering an open and welcoming environment, we as contributors and pledge to making participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.
                        </p>

                        <h3>Our Standards</h3>
                        <p>
                            Examples of behavior that contributes to creating a positive environment include:
                            <ul>
                                <li>Using welcoming and inclusive language</li>
                                <li>Being respectful of differing viewpoints and experiences</li>
                                <li>Gracefully accepting constructive criticism</li>
                                <li>Focusing on what is best for the community</li>
                                <li>Showing empathy towards other community members</li>
                            </ul>
                        </p>

                        <p>
                            Examples of unacceptable behavior by participants include:
                            <ul>
                                <li>The use of sexualized language or imagery and unwelcome sexual attention or advances</li>
                                <li>Trolling, insulting/derogatory comments, and personal or political attacks</li>
                                <li>Public or private harassment</li>
                                <li>Publishing others' private information without explicit permission</li>
                            </ul>
                        </p>

                        <h3>Enforcement</h3>
                        <p>
                            Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at report@codingbuddy.com. All complaints will be reviewed and investigated and will result in a response that is deemed necessary and appropriate to the circumstances.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CodeOfConductPage;
