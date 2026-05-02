// frontend/src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Code2, User, Mail, Lock, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Input } from '../components/ui';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.register(formData);
      setAuth(response.data.user, response.data.token);
      toast.success('Welcome to CodingBuddy! 🎉');
      navigate('/');
    } catch (error) {
      toast.error('Registration failed. Username or email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-white to-accent/10 p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4 group">
            <Code2 className="text-accent group-hover:scale-110 transition-transform" size={40} />
            <h1 className="text-3xl font-bold gradient-text">CodingBuddy</h1>
          </Link>
          <p className="text-text-secondary">Create your account and start coding</p>
        </div>

        {/* Register Card */}
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Sign Up</h2>
            <p className="text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:text-accent-600 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <Input
            type="text"
            label="Full Name"
            placeholder="John Doe"
            leftIcon={<User size={18} />}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={errors.fullName}
          />

          <Input
            type="text"
            label="Username"
            placeholder="johndoe"
            leftIcon={<UserPlus size={18} />}
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            error={errors.username}
            helperText="Minimum 3 characters"
          />

          <Input
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            leftIcon={<Mail size={18} />}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <Input
            type="password"
            label="Password"
            placeholder="Create a strong password"
            leftIcon={<Lock size={18} />}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            helperText="Minimum 6 characters"
          />

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            {!loading && 'Create Account'}
          </Button>

          <p className="text-xs text-text-tertiary text-center">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-accent hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-accent hover:underline">
              Privacy Policy
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
