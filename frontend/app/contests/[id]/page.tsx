'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { FloatingBackground } from '@/components/ui/floating-background'
import { Sidebar } from '@/components/sidebar'
import { mockProblems, mockLeaderboard } from '@/lib/mock-data'
import { 
  Trophy, 
  Clock, 
  Users, 
  Play, 
  CheckCircle, 
  Code, 
  Send,
  Eye,
  EyeOff
} from 'lucide-react'
import { useState } from 'react'

export default function ContestPage() {
  const [selectedProblem, setSelectedProblem] = useState(mockProblems[0])
  const [code, setCode] = useState('// Write your solution here\nfunction solve() {\n    \n}')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTestCases, setShowTestCases] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      // Mock submission result
      alert('Solution submitted! Result: Accepted')
    }, 2000)
  }

  return (
    <div className="min-h-screen relative">
      <FloatingBackground />
      <Sidebar />
      
      <div className="ml-64 pt-20 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Contest Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <GlassCard>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Weekly Algorithm Challenge #42</h1>
                  <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>1:23:45 remaining</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>1,247 participants</span>
                    </div>
                    <div className="flex items-center space-x-1 text-green-500">
                      <Play className="w-4 h-4" />
                      <span>Live</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-500">#156</div>
                  <div className="text-sm text-gray-500">Your Rank</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Problems List */}
            <div className="lg:col-span-1">
              <GlassCard delay={0.1}>
                <h2 className="text-xl font-semibold mb-4">Problems</h2>
                <div className="space-y-3">
                  {mockProblems.map((problem, index) => (
                    <motion.div
                      key={problem.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedProblem.id === problem.id
                          ? 'bg-cyan-500/20 border-cyan-500/50'
                          : 'bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedProblem(problem)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{problem.id}</span>
                        <CheckCircle className={`w-4 h-4 ${problem.solved > 0 ? 'text-green-500' : 'text-gray-400'}`} />
                      </div>
                      <p className="text-sm font-medium truncate">{problem.title}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded ${
                          problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-600' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-600' :
                          'bg-red-500/20 text-red-600'
                        }`}>
                          {problem.difficulty}
                        </span>
                        <span>{problem.points} pts</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              {/* Live Leaderboard */}
              <GlassCard delay={0.2} className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Live Leaderboard</h2>
                <div className="space-y-3">
                  {mockLeaderboard.slice(0, 5).map((user, index) => (
                    <div key={user.username} className="flex items-center space-x-3">
                      <span className="text-sm font-bold w-6">#{index + 1}</span>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.totalSolved} solved</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Problem Statement */}
            <div className="lg:col-span-2">
              <GlassCard delay={0.3}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Problem {selectedProblem.id}: {selectedProblem.title}</h2>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-lg text-sm ${
                      selectedProblem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-600' :
                      selectedProblem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-600' :
                      'bg-red-500/20 text-red-600'
                    }`}>
                      {selectedProblem.difficulty}
                    </span>
                    <span className="text-cyan-500 font-bold">{selectedProblem.points} pts</span>
                  </div>
                </div>

                {/* Problem Description */}
                <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
                  <p>
                    Given a binary tree, find the maximum path sum. The path may start and end at any node in the tree.
                  </p>
                  
                  <h4>Example 1:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
{`Input: root = [1,2,3]
Output: 6
Explanation: The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.`}
                  </pre>

                  <h4>Constraints:</h4>
                  <ul>
                    <li>The number of nodes in the tree is in the range [1, 3 * 10⁴].</li>
                    <li>-1000 ≤ Node.val ≤ 1000</li>
                  </ul>
                </div>

                {/* Test Cases Toggle */}
                <motion.button
                  onClick={() => setShowTestCases(!showTestCases)}
                  className="flex items-center space-x-2 mb-4 text-cyan-500 hover:text-cyan-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  {showTestCases ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showTestCases ? 'Hide' : 'Show'} Test Cases</span>
                </motion.button>

                {showTestCases && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4"
                  >
                    <h4 className="font-semibold mb-2">Sample Test Cases:</h4>
                    <div className="text-sm space-y-2">
                      <div>
                        <strong>Input:</strong> [1,2,3]<br />
                        <strong>Expected Output:</strong> 6
                      </div>
                      <div>
                        <strong>Input:</strong> [-10,9,20,null,null,15,7]<br />
                        <strong>Expected Output:</strong> 42
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Code Editor */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Solution</h3>
                    <div className="flex items-center space-x-2">
                      <select className="bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700 rounded px-3 py-1 text-sm">
                        <option>JavaScript</option>
                        <option>Python</option>
                        <option>C++</option>
                        <option>Java</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-64 p-4 bg-gray-900 text-green-400 font-mono text-sm rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                      placeholder="Write your code here..."
                    />
                    <div className="absolute top-4 right-4">
                      <Code className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                >
                  <Send className="w-5 h-5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Solution'}</span>
                </motion.button>
              </GlassCard>
            </div>

            {/* Contest Stats */}
            <div className="lg:col-span-1">
              <GlassCard delay={0.4}>
                <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">2/6</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Problems Solved</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-500">1,250</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Score</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">#156</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Current Rank</div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard delay={0.5} className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
                <div className="space-y-3">
                  {[
                    { problem: 'A', status: 'Accepted', time: '2 min ago', color: 'text-green-500' },
                    { problem: 'B', status: 'Wrong Answer', time: '8 min ago', color: 'text-red-500' },
                    { problem: 'A', status: 'Time Limit', time: '12 min ago', color: 'text-yellow-500' }
                  ].map((submission, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/10 dark:bg-white/5 rounded">
                      <div>
                        <span className="font-semibold">{submission.problem}</span>
                        <div className={`text-sm ${submission.color}`}>{submission.status}</div>
                      </div>
                      <div className="text-xs text-gray-500">{submission.time}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}