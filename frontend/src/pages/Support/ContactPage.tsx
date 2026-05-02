// frontend/src/pages/Support/ContactPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

const ContactPage = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container-custom max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                    <p className="text-text-secondary">
                        Have questions or need assistance? We're here to help.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="card p-6">
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
                                <Mail size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Email Us</h3>
                            <p className="text-text-secondary text-sm mb-4">
                                For general inquiries and support
                            </p>
                            <a href="mailto:support@codingbuddy.com" className="text-accent hover:underline">
                                support@codingbuddy.com
                            </a>
                        </div>

                        <div className="card p-6">
                            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                                <MessageSquare size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Community</h3>
                            <p className="text-text-secondary text-sm mb-4">
                                Join the discussion on our forums
                            </p>
                            <a href="/discuss" className="text-accent hover:underline">
                                Visit Discussions
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="card p-8"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-accent focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-accent focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-accent focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Message</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-accent focus:outline-none resize-none"
                                    />
                                </div>

                                <Button
                                    loading={loading}
                                    type="submit"
                                    variant="primary"
                                    className="w-full"
                                    icon={<Send size={18} />}
                                >
                                    Send Message
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
