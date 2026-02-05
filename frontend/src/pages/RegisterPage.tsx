import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Code2, Loader } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.register(formData);
      setAuth(response.data.user, response.data.token);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50 dark:from-dark-950 dark:to-dark-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Code2 className="text-primary-600" size={40} />
            <h1 className="text-3xl font-bold gradient-text">CodingBuddy</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              required
              className="input"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              required
              className="input"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="johndoe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              required
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
