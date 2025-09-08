'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  Settings, 
  User, 
  Shield,
  Code
} from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/contests', label: 'Contests', icon: Trophy },
    { href: '/leaderboard', label: 'Leaderboard', icon: Users },
    { href: '/profile/codewizard', label: 'Profile', icon: User },
    { href: '/admin', label: 'Admin', icon: Shield },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <motion.div
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-r border-white/20 dark:border-gray-800/50 p-6 z-40"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        {navItems.map(({ href, label, icon: Icon }, index) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={href}>
              <motion.div
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === href
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-600 dark:text-cyan-400 shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-cyan-600 dark:hover:text-cyan-400'
                }`}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom section */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-200/20 dark:border-cyan-800/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">CodingBuddy</p>
              <p className="text-xs text-gray-500">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}