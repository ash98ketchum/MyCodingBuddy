import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Code2, LogOut, User, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Code2 className="text-primary-600" size={32} />
            <span className="text-xl font-bold gradient-text">CodingBuddy</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/problems" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
              Problems
            </Link>
            <Link to="/leaderboard" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
              Leaderboard
            </Link>
            
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
                <Shield size={16} />
                Admin
              </Link>
            )}

            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
                <User size={18} />
                <span className="font-medium">{user?.username}</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
