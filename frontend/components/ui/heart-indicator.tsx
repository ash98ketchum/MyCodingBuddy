'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface HeartIndicatorProps {
  hearts: number
  maxHearts?: number
  size?: 'sm' | 'md' | 'lg'
}

export function HeartIndicator({ hearts, maxHearts = 100, size = 'md' }: HeartIndicatorProps) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <motion.div
      className="flex items-center space-x-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Heart className={`${sizeMap[size]} fill-pink-500 text-pink-500`} />
      </motion.div>
      <span className="font-semibold text-pink-600 dark:text-pink-400">
        {hearts}/{maxHearts}
      </span>
      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(hearts / maxHearts) * 100}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </motion.div>
  )
}