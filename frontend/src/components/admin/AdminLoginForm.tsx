import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { adminApi } from '../../services/adminAuthApi';
import toast from 'react-hot-toast';
import { Input, Button } from '../ui';

const AdminLoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // UI States
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorShake, setErrorShake] = useState(false);

    const navigate = useNavigate();
    const { setAuth } = useAdminAuthStore();
    const emailRef = useRef<HTMLInputElement>(null);

    // Auto-focus email on mount
    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.focus();
        }
    }, []);

    const triggerErrorShake = () => {
        setErrorShake(true);
        setTimeout(() => setErrorShake(false), 500);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please fill in all fields');
            triggerErrorShake();
            return;
        }

        setIsLoading(true);

        try {
            const rawResponse = await adminApi.login({ email, password }) as any;
            const responseData = rawResponse.data;

            // Check if user is actually an admin returned from backend
            if (!responseData || !responseData.user || responseData.user.role !== 'ADMIN') {
                toast.error('Unauthorized. Required Admin privileges.');
                console.error("Login failed. Role or structure invalid:", rawResponse);
                triggerErrorShake();
                setIsLoading(false);
                return;
            }

            // Success Transition
            setIsSuccess(true);
            setAuth(responseData.user, responseData.token);

            // Slight delay to show the nice success animation before routing
            setTimeout(() => {
                navigate('/admin/dashboard', { replace: true });
            }, 800);

        } catch (error: any) {
            triggerErrorShake();
            const msg = error.response?.data?.message || 'Invalid credentials or server error';
            toast.error(msg);
            setPassword(''); // Clear password on failure
        } finally {
            if (!isSuccess) {
                setIsLoading(false);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full card p-8 sm:p-10 backdrop-blur-sm"
        >
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-text-primary tracking-tight mb-2">Welcome Back</h2>
                <p className="text-text-secondary text-sm">Sign in to the Control System</p>
            </div>

            <motion.form
                onSubmit={handleLogin}
                className="space-y-6"
                animate={errorShake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
            >
                <Input
                    ref={emailRef}
                    type="email"
                    label="Admin Email"
                    placeholder="admin@mycodingbuddy.com"
                    leftIcon={<Mail size={18} />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || isSuccess}
                    autoComplete="email"
                />

                <Input
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    placeholder="••••••••"
                    leftIcon={<Lock size={18} />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                            disabled={isLoading || isSuccess}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || isSuccess}
                    autoComplete="current-password"
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full relative mt-4 overflow-hidden group"
                    disabled={isLoading || isSuccess}
                    loading={isLoading && !isSuccess}
                >
                    {/* Subtle button gradient shine */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                    {!isLoading && !isSuccess && <span>Sign In</span>}
                    {isSuccess && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2"
                        >
                            <CheckCircle2 size={20} className="text-white" />
                            <span>Authenticated</span>
                        </motion.div>
                    )}
                </Button>
            </motion.form>
        </motion.div>
    );
};

export default AdminLoginForm;
