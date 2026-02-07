import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-dark-900 border-t border-gray-100 dark:border-dark-800 mt-auto">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <Code2 className="text-accent" size={32} />
                            <span className="text-xl font-bold gradient-text">CodingBuddy</span>
                        </Link>
                        <p className="text-text-secondary text-sm max-w-md">
                            Master competitive programming with 500+ problems, real-time code execution,
                            and comprehensive analytics. Level up your coding skills today.
                        </p>
                        <div className="flex gap-4 mt-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-accent transition-colors"
                                aria-label="GitHub"
                            >
                                <Github size={20} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-accent transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter size={20} />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-accent transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={20} />
                            </a>
                            <a
                                href="mailto:support@codingbuddy.com"
                                className="text-gray-400 hover:text-accent transition-colors"
                                aria-label="Email"
                            >
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/problems" className="text-text-secondary hover:text-accent transition-colors">
                                    Problems
                                </Link>
                            </li>
                            <li>
                                <Link to="/leaderboard" className="text-text-secondary hover:text-accent transition-colors">
                                    Leaderboard
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-text-secondary hover:text-accent transition-colors">
                                    Tutorials
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-text-secondary hover:text-accent transition-colors">
                                    Documentation
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-text-secondary hover:text-accent transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-text-secondary hover:text-accent transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-text-secondary hover:text-accent transition-colors">
                                    Cookie Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-text-secondary hover:text-accent transition-colors">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-100 dark:border-dark-800 mt-8 pt-8 text-center text-sm text-text-secondary">
                    <p>&copy; {currentYear} CodingBuddy. All rights reserved. Made with ❤️ for developers.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
