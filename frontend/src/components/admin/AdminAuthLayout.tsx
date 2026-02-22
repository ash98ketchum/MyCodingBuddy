import React from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-900 selection:bg-accent/30 font-sans">

            {/* LEFT SIDE - Branding & Background */}
            <div className="relative flex-1 hidden md:flex flex-col justify-between p-12 overflow-hidden border-r border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-100">

                {/* Animated Background Elements */}
                <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent rounded-full blur-[120px] mix-blend-multiply opacity-20" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-600 rounded-full blur-[120px] mix-blend-multiply opacity-20" />

                    {/* Subtle Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0wIDQwaDQwTTEwIDB2NDBNMjAgMHY0ME0zMCAwdjQwTTQwIDB2NDAiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjA0KSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==')] opacity-60" />
                </div>

                {/* Branding Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 flex items-center gap-3"
                >
                    <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20 backdrop-blur-md shadow-sm">
                        <Shield className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent-600 to-accent-800">
                        MyCodingBuddy
                    </span>
                </motion.div>

                {/* Central Messaging */}
                <div className="relative z-10 max-w-lg mt-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1] text-gray-900"
                    >
                        Admin Control<br />System
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="text-lg text-gray-600 leading-relaxed font-light"
                    >
                        Secure access to platform management. Monitor activity, manage programs, and configure automated assignments in a highly secure environment.
                    </motion.p>
                </div>

                {/* Footer info left side */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="relative z-10 mt-auto text-sm text-gray-500 flex items-center gap-2 font-medium"
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                    Systems operational & secure
                </motion.div>
            </div>

            {/* RIGHT SIDE - Form Content */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-white">

                {/* Mobile Header (Only visible on small screens) */}
                <div className="md:hidden flex items-center gap-3 mb-10 absolute top-8 left-8">
                    <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                        <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-semibold text-gray-900">MCB Admin</span>
                </div>

                {/* Children (The Form) mapped into the right side */}
                <div className="w-full max-w-[420px] relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminAuthLayout;
