'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/glass-card'
import { FloatingBackground } from '@/components/ui/floating-background'
import { Sidebar } from '@/components/sidebar'
import { mockContests } from '@/lib/mock-data'
import { Trophy, Calendar, Clock, Users, Plus, Play, CheckCircle } from 'lucide-react'

export default function Contests() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Calendar className="w-5 h-5 text-blue-500" />
      case 'live':
        return <Play className="w-5 h-5 text-green-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-gray-500" />
      default:
        return <Calendar className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
      case 'live':
        return 'bg-green-500/20 text-green-600 dark:text-green-400'
      case 'completed':
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
      default:
        return 'bg-gray-500/20 text-gray-600'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/20 text-green-600 dark:text-green-400'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
      case 'hard':
        return 'bg-red-500/20 text-red-600 dark:text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-600'
    }
  }

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
                  <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">Contests</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Compete with coders worldwide</p>
              </div>
              
              <motion.button
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>Create Contest</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Contest Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <GlassCard delay={0.1}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard delay={0.2}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Live Now</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard delay={0.3}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Participated</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Contests List */}
          <div className="space-y-6">
            {mockContests.map((contest, index) => (
              <motion.div
                key={contest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <GlassCard>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Contest Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold">{contest.title}</h3>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(contest.status)}`}>
                          {getStatusIcon(contest.status)}
                          <span className="capitalize">{contest.status}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(contest.difficulty)}`}>
                          {contest.difficulty}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{contest.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{contest.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{contest.participants.toLocaleString()} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4" />
                          <span>{contest.problems} problems</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <Link href={`/contests/${contest.id}`}>
                        <motion.button
                          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                            contest.status === 'live'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl'
                              : contest.status === 'upcoming'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg hover:shadow-xl'
                              : 'bg-gray-500/20 text-gray-600 dark:text-gray-400 hover:bg-gray-500/30'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {contest.status === 'live' ? 'Join Now' : contest.status === 'upcoming' ? 'Register' : 'View Results'}
                        </motion.button>
                      </Link>
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
              className="px-8 py-3 backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-2xl font-semibold hover:bg-white/30 dark:hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Load More Contests
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}