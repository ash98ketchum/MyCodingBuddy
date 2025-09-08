'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { FloatingBackground } from '@/components/ui/floating-background'
import { AnimatedChart } from '@/components/ui/animated-chart'
import { Sidebar } from '@/components/sidebar'
import { HeartIndicator } from '@/components/ui/heart-indicator'
import { mockUser, mockRatingHistory } from '@/lib/mock-data'
import { 
  Trophy, 
  Target, 
  Flame, 
  Calendar,
  Github,
  ExternalLink,
  Award,
  TrendingUp,
  Code
} from 'lucide-react'

export default function ProfilePage() {
  const achievements = [
    { id: 1, title: 'First Solve', description: 'Solved your first problem', icon: Trophy, color: 'text-yellow-500' },
    { id: 2, title: 'Speed Demon', description: 'Solved 10 problems in under 1 hour', icon: Flame, color: 'text-orange-500' },
    { id: 3, title: 'Consistent Coder', description: 'Maintained a 30-day streak', icon: Calendar, color: 'text-blue-500' },
    { id: 4, title: 'Algorithm Master', description: 'Solved 100 algorithm problems', icon: Code, color: 'text-purple-500' }
  ]

  const platformData = [
    { name: 'LeetCode', rating: mockUser.leetcodeRating, solved: 234, color: '#FFA116' },
    { name: 'Codeforces', rating: mockUser.codeforcesRating, solved: 189, color: '#1F8ACB' },
    { name: 'CodeChef', rating: mockUser.codechefRating, solved: 167, color: '#5B4638' }
  ]

  const recentActivity = [
    { date: '2025-01-14', problems: 5, contest: 'Weekly Challenge #42' },
    { date: '2025-01-13', problems: 3, contest: null },
    { date: '2025-01-12', problems: 7, contest: 'Speed Coding Sprint' },
    { date: '2025-01-11', problems: 2, contest: null },
    { date: '2025-01-10', problems: 4, contest: 'Math Algorithms' }
  ]

  return (
    <div className="min-h-screen relative">
      <FloatingBackground />
      <Sidebar />
      
      <div className="ml-64 pt-24 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <GlassCard>
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar */}
                <motion.img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="w-32 h-32 rounded-full border-4 border-cyan-400 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                />

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h1 className="text-4xl font-bold">{mockUser.name}</h1>
                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-600 dark:text-cyan-400 rounded-lg text-sm font-semibold">
                      {mockUser.rank}
                    </span>
                  </div>
                  
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">@{mockUser.username}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-500">{mockUser.rating}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">{mockUser.totalSolved}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Solved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">{mockUser.streak}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <HeartIndicator hearts={mockUser.hearts} size="md" />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-col space-y-3">
                  <motion.button
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </motion.button>
                  
                  <motion.button
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>CF</span>
                    <span>Codeforces</span>
                    <ExternalLink className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rating History */}
            <div className="lg:col-span-2">
              <GlassCard delay={0.1}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Rating Progress</h2>
                  <div className="flex items-center space-x-2 text-green-500">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold">+156 this month</span>
                  </div>
                </div>
                <div className="h-80">
                  <AnimatedChart type="line" data={mockRatingHistory} />
                </div>
              </GlassCard>
            </div>

            {/* Achievements */}
            <div>
              <GlassCard delay={0.2}>
                <h2 className="text-2xl font-semibold mb-6">Achievements</h2>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-white/10 dark:bg-white/5 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{achievement.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Platform Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {platformData.map((platform, index) => (
              <GlassCard key={platform.name} delay={0.4 + index * 0.1}>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">{platform.name}</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold mb-1" style={{ color: platform.color }}>
                        {platform.rating}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                        {platform.solved}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Problems Solved</div>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{
                          backgroundColor: platform.color,
                          width: `${Math.min((platform.rating / 2500) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Recent Activity */}
          <GlassCard delay={0.7} className="mt-8">
            <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/10 dark:bg-white/5 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                    <div>
                      <div className="font-semibold">
                        Solved {activity.problems} problems
                        {activity.contest && (
                          <span className="ml-2 text-sm text-cyan-500">in {activity.contest}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(activity.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-cyan-500">
                    <Target className="w-4 h-4" />
                    <span className="font-semibold">+{activity.problems * 25}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}