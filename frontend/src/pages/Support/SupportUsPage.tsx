import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Phone, CreditCard, Heart, Copy, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

// @ts-ignore
import qrImage from '../../assests/QR/WhatsApp Image 2026-03-02 at 9.14.19 AM.jpeg';

const SupportUsPage = () => {
    const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

    const supportDetails = [
        {
            id: 1,
            label: 'Phone Number',
            value: '+91 9027370595', // Placeholder
            icon: <Phone className="w-5 h-5 text-accent" />
        },
        {
            id: 2,
            label: 'UPI ID',
            value: 'anirudhchauhan8074@oksbi', // Placeholder
            icon: <CreditCard className="w-5 h-5 text-secondary" />
        }
    ];

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="min-h-screen bg-background py-16 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

            <div className="container-custom max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-rose-50 dark:bg-rose-500/10 rounded-2xl mb-6">
                        <Heart className="w-8 h-8 text-rose-500 fill-rose-500/20" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                        Support the Creator
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Your support keeps the servers running and helps us build better tools for students and developers. Every contribution makes a huge difference!
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {/* QR Code Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card p-8 flex flex-col items-center justify-center text-center bg-white dark:bg-dark-800 border-2 border-accent/10 shadow-xl shadow-accent/5 rounded-3xl"
                    >
                        <h3 className="text-xl font-bold mb-2 inline-flex items-center gap-2">
                            <QrCode className="w-6 h-6 text-accent" /> Scan to Pay
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-xs">
                            Use any UPI app (GPay, PhonePe, Paytm) to scan the QR code below.
                        </p>

                        <div className="relative p-4 bg-white border border-gray-100 rounded-3xl shadow-sm group">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            {/* User's uploaded QR Image */}
                            <div className="w-48 h-48 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden relative z-10">
                                <img src={qrImage} alt="Support QR Code" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Manual Details Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card p-8 flex flex-col justify-center bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 shadow-lg rounded-3xl"
                    >
                        <h3 className="text-xl font-bold mb-6">Payment Details</h3>
                        <div className="space-y-6">
                            {supportDetails.map((detail, index) => (
                                <div key={detail.id} className="group p-4 bg-gray-50 dark:bg-dark-900 rounded-2xl border border-gray-100 dark:border-dark-700 transition-all hover:border-accent/40">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                            {detail.icon} {detail.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-mono font-bold text-gray-900 dark:text-white tracking-wide">
                                            {detail.value}
                                        </span>
                                        <button
                                            onClick={() => copyToClipboard(detail.value, index)}
                                            className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-xl transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            {copiedIndex === index ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <Copy className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                            <p className="text-sm text-blue-700 dark:text-blue-400 font-medium flex gap-2">
                                <Heart className="w-5 h-5 shrink-0" />
                                Thank you for being an amazing part of our community!
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SupportUsPage;
