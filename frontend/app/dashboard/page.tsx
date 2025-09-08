'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { FloatingBackground } from '@/components/ui/floating-background'
import { AnimatedChart } from '@/components/ui/animated-chart'
import { Sidebar } from '@/components/sidebar'
import { HeartIndicator } from '@/components/ui/heart-indicator'
import { mockUser, mockRatingHistory } from '@/lib/mock-data'
import { Trophy, Target, Flame, Code, Github, ExternalLink } from 'lucide-react'

export default function Dashboard() {
  const platformStats = [
    { name: 'LeetCode', value: mockUser.leetcodeRating, color: '#FFA116' },
    { name: 'Codeforces', value: mockUser.codeforcesRating, color: '#1F8ACB' },
    { name: 'CodeChef', value: mockUser.codechefRating, color: '#5B4638' },
  ]

  const activityData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 19 },
    { name: 'Wed', value: 8 },
    { name: 'Thu', value: 25 },
    { name: 'Fri', value: 16 },
    { name: 'Sat', value: 31 },
    { name: 'Sun', value: 22 },
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
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">{mockUser.name}</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Here's your coding journey overview</p>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <GlassCard delay={0.1}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockUser.rating}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Rating</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard delay={0.2}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockUser.totalSolved}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Problems Solved</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard delay={0.3}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockUser.streak}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard delay={0.4}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold mb-2">Hearts</p>
                  <HeartIndicator hearts={mockUser.hearts} size="md" />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <GlassCard delay={0.5}>
              <h3 className="text-xl font-semibold mb-4">Rating Progress</h3>
              <div className="h-64">
                <AnimatedChart type="line" data={mockRatingHistory} />
              </div>
            </GlassCard>

            <GlassCard delay={0.6}>
              <h3 className="text-xl font-semibold mb-4">Weekly Activity</h3>
              <div className="h-64">
                <AnimatedChart type="bar" data={activityData} />
              </div>
            </GlassCard>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <GlassCard delay={0.7} className="lg:col-span-2">
              <h3 className="text-xl font-semibold mb-6">Platform Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {platformStats.map((platform, index) => (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="text-center p-4 rounded-xl bg-white/20 dark:bg-white/5"
                  >
                    <h4 className="font-semibold mb-2">{platform.name}</h4>
                    <div className="text-3xl font-bold mb-2" style={{ color: platform.color }}>
                      {platform.value}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{
                          backgroundColor: platform.color,
                          width: `${(platform.value / 2500) * 100}%`
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard delay={0.8}>
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <motion.button
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Code className="w-5 h-5 text-cyan-500" />
                  <span>Practice Problems</span>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </motion.button>

                <motion.button
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trophy className="w-5 h-5 text-purple-500" />
                  <span>Join Contest</span>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </motion.button>

                <motion.button
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-gray-500/10 to-gray-600/10 hover:from-gray-500/20 hover:to-gray-600/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span>GitHub Sync</span>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </motion.button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}