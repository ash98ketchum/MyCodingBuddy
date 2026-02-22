import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { motion } from 'framer-motion';

export const AdminLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
            {/* Sidebar Navigation */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top Gradient Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 via-accent to-accent-600 z-50 opacity-100" />

                {/* Content Outlet for matching routes */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar"
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
};
