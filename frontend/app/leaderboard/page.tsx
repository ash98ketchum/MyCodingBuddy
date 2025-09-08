'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { FloatingBackground } from '@/components/ui/floating-background'
import { Sidebar } from '@/components/sidebar'
import { HeartIndicator } from '@/components/ui/heart-indicator'
import { mockLeaderboard } from '@/lib/mock-data'
import { Trophy, Crown, Medal, Filter, Search } from 'lucide-react'
import { useState } from 'react'

export default function Leaderboard() {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{rank}</span>
    }
  }

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30'
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30'
      default:
        return 'bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10'
    }
  }

  return (
    <div className="min-h-screen relative">
      <FloatingBackground />
      <Sidebar />
      
      <div className="ml-64 pt-24 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">
              Global <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">Leaderboard</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">See where you rank among the world's best coders</p>
          </motion.div>

          {/* Filters and Search */}
          <GlassCard delay={0.1} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="all">All Time</option>
                  <option value="month">This Month</option>
                  <option value="week">This Week</option>
                </select>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </GlassCard>

          {/* Leaderboard */}
          <div className="space-y-4">
            {mockLeaderboard.map((user, index) => (
              <motion.div
                key={user.username}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <GlassCard 
                  className={`${getRankBackground(user.rank)} transform hover:scale-[1.02] transition-all duration-300`}
                  hover={false}
                >
                  <div className="flex items-center space-x-6">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(user.rank)}
                    </div>

                    {/* Avatar */}
                    <motion.img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full border-2 border-cyan-400"
                      whileHover={{ scale: 1.1 }}
                    />

                    {/* User Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center space-x-8">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-cyan-500">{user.rating}</p>
                        <p className="text-xs text-gray-500">Rating</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-semibold">{user.totalSolved}</p>
                        <p className="text-xs text-gray-500">Solved</p>
                      </div>
                      <div className="text-center">
                        <HeartIndicator hearts={user.hearts} maxHearts={200} size="sm" />
                      </div>
                    </div>

                    {/* Mobile stats */}
                    <div className="sm:hidden">
                      <p className="text-xl font-bold text-cyan-500">{user.rating}</p>
                      <p className="text-sm text-gray-500">{user.totalSolved} solved</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Load More
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}