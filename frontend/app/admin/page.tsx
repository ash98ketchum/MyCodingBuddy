'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { FloatingBackground } from '@/components/ui/floating-background'
import { Sidebar } from '@/components/sidebar'
import { mockContests } from '@/lib/mock-data'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Trophy, 
  Clock,
  Settings,
  BarChart3
} from 'lucide-react'
import { useState } from 'react'

export default function Admin() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const adminStats = [
    { label: 'Total Contests', value: 48, icon: Trophy, color: 'from-cyan-500 to-blue-500' },
    { label: 'Active Users', value: '12.4K', icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Problems Created', value: 324, icon: Settings, color: 'from-green-500 to-emerald-500' },
    { label: 'This Month', value: 8, icon: BarChart3, color: 'from-orange-500 to-red-500' }
  ]

  return (
    <div className="min-h-screen relative">
      <FloatingBackground />
      <Sidebar />
      
      <div className="ml-64 pt-24 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">Admin Panel</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Manage contests, users, and platform settings</p>
              </div>
              
              <motion.button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>Create Contest</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {adminStats.map((stat, index) => (
              <GlassCard key={stat.label} delay={index * 0.1}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Contest Management */}
          <GlassCard delay={0.5}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Contest Management</h2>
              <div className="flex items-center space-x-2">
                <select className="bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option>All Contests</option>
                  <option>Live</option>
                  <option>Upcoming</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-white/20 dark:border-gray-700">
                    <th className="pb-3 font-semibold">Contest</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Participants</th>
                    <th className="pb-3 font-semibold">Duration</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockContests.map((contest, index) => (
                    <motion.tr
                      key={contest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="border-b border-white/10 dark:border-gray-800 hover:bg-white/5 dark:hover:bg-white/5"
                    >
                      <td className="py-4">
                        <div>
                          <div className="font-semibold">{contest.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {contest.problems} problems
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          contest.status === 'live' 
                            ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                            : contest.status === 'upcoming'
                            ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                            : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                        }`}>
                          {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{contest.participants.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{contest.duration}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <GlassCard delay={0.8}>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Contest Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  View detailed analytics and performance metrics
                </p>
                <motion.button
                  className="px-4 py-2 bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  View Analytics
                </motion.button>
              </div>
            </GlassCard>

            <GlassCard delay={0.9}>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">User Management</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Manage user accounts, roles, and permissions
                </p>
                <motion.button
                  className="px-4 py-2 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Manage Users
                </motion.button>
              </div>
            </GlassCard>

            <GlassCard delay={1.0}>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Platform Settings</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Configure platform settings and preferences
                </p>
                <motion.button
                  className="px-4 py-2 bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Settings
                </motion.button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Create Contest Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-4"
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Create New Contest</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Contest Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter contest title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    className="w-full px-3 py-2 bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 h-24 resize-none"
                    placeholder="Contest description"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <select className="w-full px-3 py-2 bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <option>1 hour</option>
                      <option>2 hours</option>
                      <option>3 hours</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <select className="w-full px-3 py-2 bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <motion.button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-500/20 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Contest
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  )
}