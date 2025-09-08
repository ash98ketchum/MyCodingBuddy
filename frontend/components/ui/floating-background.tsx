'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  symbol: string
  delay: number
  duration: number
}

export function FloatingBackground() {
  const [particles, setParticles] = useState<Particle[]>([])

  const symbols = ['∑', '∫', 'π', '∞', '∆', '∇', 'λ', 'Ω', '∈', '∉', '⊂', '⊃', '∪', '∩', '≈', '≠', '≤', '≥', '√', '∝']

  useEffect(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 10
      })
    }
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-pink-950/30" />
      
      {/* Floating bubbles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full bg-gradient-to-r from-cyan-200/20 to-blue-200/20 dark:from-cyan-400/10 dark:to-blue-400/10 blur-xl"
          style={{
            width: Math.random() * 200 + 100,
            height: Math.random() * 200 + 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Mathematical symbols */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-2xl font-thin text-cyan-400/20 dark:text-cyan-300/10 select-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25],
            y: [0, -100],
            opacity: [0, 0.5, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            delay: particle.delay,
          }}
        >
          {particle.symbol}
        </motion.div>
      ))}
    </div>
  )
}