import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Code2, Loader } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.login(formData);
      setAuth(response.data.user, response.data.token);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Login failed');
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
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Login to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
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
            {loading ? <Loader className="animate-spin" size={20} /> : 'Sign In'}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
