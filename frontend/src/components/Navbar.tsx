// frontend/src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Code2, LogOut, User, Shield, Menu, X } from 'lucide-react';
import clsx from 'clsx';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/problems', label: 'Problems' },
    { path: '/leaderboard', label: 'Leaderboard' },
  ];

  return (
    <nav
      className={clsx(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 dark:bg-dark-900/80 backdrop-blur-md shadow-md'
          : 'bg-white dark:bg-dark-900 border-b border-gray-100 dark:border-dark-800'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Code2 className="text-accent group-hover:scale-110 transition-transform" size={32} />
            <span className="text-xl font-bold gradient-text">CodingBuddy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'relative text-sm font-medium transition-colors py-2',
                  isActive(link.path)
                    ? 'text-accent'
                    : 'text-gray-700 dark:text-gray-300 hover:text-accent'
                )}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent animate-slide-in-left" />
                )}
              </Link>
            ))}

            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={clsx(
                  'flex items-center gap-1 text-sm font-medium transition-colors',
                  isActive('/admin')
                    ? 'text-accent'
                    : 'text-gray-700 dark:text-gray-300 hover:text-accent'
                )}
              >
                <Shield size={16} />
                Admin
              </Link>
            )}

            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200 dark:border-dark-700">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white font-medium text-sm">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-sm text-gray-900 dark:text-gray-100 group-hover:text-accent transition-colors">
                  {user?.username}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-error hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-accent"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-dark-800 animate-slide-down">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(link.path)
                      ? 'bg-accent/10 text-accent'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive('/admin')
                      ? 'bg-accent/10 text-accent'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800'
                  )}
                >
                  <Shield size={16} />
                  Admin
                </Link>
              )}

              <div className="border-t border-gray-100 dark:border-dark-800 my-2" />

              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
              >
                <User size={16} />
                Profile ({user?.username})
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-error hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

