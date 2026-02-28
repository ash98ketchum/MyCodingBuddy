import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileSpreadsheet, FilePlus, Mail, School, CreditCard, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminAuthStore } from '../../store/adminAuthStore';

export const AdminSidebar: React.FC = () => {
    const { activeCollegeId, setActiveCollege } = useAdminAuthStore();

    const SUPER_ADMIN_NAV = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Colleges & Programs', path: '/admin/programs', icon: Users },
        { name: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCard },
    ];

    const COLLEGE_ADMIN_NAV = [
        { name: 'College Analytics', path: `/admin/college/${activeCollegeId}`, icon: School },
        { name: 'Assign Problems', path: '/admin/program/assign', icon: FilePlus },
        { name: 'Email Automation', path: '/admin/email', icon: Mail },
        { name: 'EOD Reports', path: '/admin/reports/eod', icon: FileSpreadsheet },
    ];

    const NAV_ITEMS = activeCollegeId ? COLLEGE_ADMIN_NAV : SUPER_ADMIN_NAV;

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col overflow-y-auto shadow-sm"
        >
            <div className="p-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-accent to-accent-600 bg-clip-text text-transparent">
                    {activeCollegeId ? 'College System' : 'Admin Portal'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">v2.0 System</p>

                {/* Back to Global Admin Button */}
                {activeCollegeId && (
                    <button
                        onClick={() => setActiveCollege(null)}
                        className="mt-4 flex items-center gap-2 text-sm text-accent hover:text-accent-600 transition-colors bg-accent/10 py-1.5 px-3 rounded-lg w-full justify-center border border-accent/20"
                    >
                        <ArrowLeft size={16} />
                        Exit College Mode
                    </button>
                )}
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-accent/10 text-accent-700 border border-accent/20'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon
                                    className={`w-5 h-5 transition-colors ${isActive ? 'text-accent-600' : 'text-gray-500 group-hover:text-gray-700'
                                        }`}
                                />
                                <span className="font-medium text-sm">{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 w-1 h-8 bg-accent rounded-r-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-gray-200">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-accent-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                        AD
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Administrator</p>
                        <p className="text-xs text-gray-500">Root Access</p>
                    </div>
                </div>
            </div>
        </motion.aside>
    );
};
