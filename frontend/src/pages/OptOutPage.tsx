import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

const OptOutPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Processing your request...');

    useEffect(() => {
        const processOptOut = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Invalid opt-out link.');
                return;
            }

            try {
                const response = await api.post('/invitation/opt-out', { token });
                setStatus('success');
                setMessage(response.data?.message || 'You have successfully opted out of the program.');
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Failed to process opt-out. The link may have expired or is invalid.');
            }
        };

        processOptOut();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center"
            >
                <div className="flex justify-center mb-6">
                    {status === 'loading' && (
                        <Loader2 className="w-16 h-16 text-accent animate-spin" />
                    )}
                    {status === 'success' && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                        >
                            <CheckCircle2 className="w-20 h-20 text-green-500" />
                        </motion.div>
                    )}
                    {status === 'error' && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                        >
                            <XCircle className="w-20 h-20 text-red-500" />
                        </motion.div>
                    )}
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {status === 'loading' ? 'Processing...' : status === 'success' ? 'Opt-Out Successful' : 'Opt-Out Failed'}
                </h1>

                <p className="text-gray-600 mb-8">
                    {message}
                </p>

                <div className="space-y-3">
                    {status !== 'loading' && (
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors"
                        >
                            Return to Homepage
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default OptOutPage;
