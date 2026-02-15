// frontend/src/components/Footer.tsx
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, Code2, MessageSquare, TrendingUp } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        platform: [
            { name: 'Problems', path: '/problems' },
            { name: 'Discuss', path: '/discuss' },
            { name: 'Leaderboard', path: '/leaderboard' },
            { name: 'About', path: '/about' },
        ],
        resources: [
            { name: 'Documentation', path: '/docs' },
            { name: 'API Reference', path: '/api-docs' },
            { name: 'Tutorials', path: '/tutorials' },
            { name: 'Blog', path: '/blog' },
        ],
        support: [
            { name: 'Help Center', path: '/help' },
            { name: 'Contact Us', path: '/contact' },
            { name: 'Report Bug', path: '/report' },
            { name: 'Feature Request', path: '/feature-request' },
        ],
        legal: [
            { name: 'Terms of Service', path: '/terms' },
            { name: 'Privacy Policy', path: '/privacy' },
            { name: 'Code of Conduct', path: '/code-of-conduct' },
            { name: 'License', path: '/license' },
        ],
    };

    const socialLinks = [
        { icon: Github, href: 'https://github.com', label: 'GitHub' },
        { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
        { icon: Mail, href: 'mailto:contact@codingbuddy.com', label: 'Email' },
    ];

    return (
        <footer className="bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700 mt-auto">
            <div className="container-custom py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="inline-flex items-center gap-2 mb-4">
                            <Code2 className="text-accent" size={28} />
                            <span className="text-xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                                CodingBuddy
                            </span>
                        </Link>
                        <p className="text-sm text-text-secondary mb-4">
                            Master algorithms, ace interviews, and level up your coding skills with our comprehensive platform.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-dark-800 hover:bg-accent hover:text-white dark:hover:bg-accent transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h3 className="font-semibold text-text-primary mb-4">Platform</h3>
                        <ul className="space-y-2">
                            {footerLinks.platform.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-text-secondary hover:text-accent transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="font-semibold text-text-primary mb-4">Resources</h3>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-text-secondary hover:text-accent transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-semibold text-text-primary mb-4">Support</h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-text-secondary hover:text-accent transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-semibold text-text-primary mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-text-secondary hover:text-accent transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-gray-200 dark:border-dark-700 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <Code2 size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary">500+</p>
                            <p className="text-xs text-text-secondary">Coding Problems</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary">10K+</p>
                            <p className="text-xs text-text-secondary">Active Discussions</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-success/10 text-success">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text-primary">50K+</p>
                            <p className="text-xs text-text-secondary">Solutions Submitted</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
                    <p>
                        © {currentYear} CodingBuddy. All rights reserved.
                    </p>
                    <p>
                        Empowering developers to code better, faster, stronger.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
