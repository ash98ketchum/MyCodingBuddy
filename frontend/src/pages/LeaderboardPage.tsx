import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '@/types';
import api from '@/services/api';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '../components/ui';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await api.getLeaderboard();
      setLeaderboard(response.data);
    } finally {
      setLoading(false);
    }
  };

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container-custom">
          <Skeleton variant="text" className="h-12 w-64 mb-8" />

          {/* Podium skeleton */}
          <div className="flex items-end justify-center gap-4 mb-12">
            <Skeleton variant="rectangular" className="h-48 w-32" />
            <Skeleton variant="rectangular" className="h-64 w-32" />
            <Skeleton variant="rectangular" className="h-40 w-32" />
          </div>

          {/* Table skeleton */}
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-accent to-secondary';
  };

  const getPodiumHeight = (rank: number) => {
    if (rank === 1) return 'h-64';
    if (rank === 2) return 'h-48';
    if (rank === 3) return 'h-40';
    return 'h-32';
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="text-accent" size={40} />
            <h1 className="text-4xl font-bold">Leaderboard</h1>
          </div>
          <p className="text-text-secondary text-lg">
            Top performers in competitive programming
          </p>
        </motion.div>

        {/* Top 3 Podium */}
        {top3.length >= 3 && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-end justify-center gap-4 max-w-4xl mx-auto">
              {/* 2nd Place */}
              {top3[1] && (
                <motion.div
                  className="flex-1 max-w-xs"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-center mb-4">
                    <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${getMedalColor(2)} flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-3`}>
                      {top3[1].username.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-semibold text-lg truncate">{top3[1].username}</h3>
                    <p className="text-sm text-text-secondary">{top3[1].rating} rating</p>
                  </div>
                  <div className={`${getPodiumHeight(2)} bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-t-2xl flex flex-col items-center justify-center shadow-xl relative`}>
                    <Medal className="text-gray-400 mb-2" size={32} />
                    <div className="text-3xl font-bold text-gray-500">#2</div>
                    <div className="text-sm text-gray-500 mt-1">{top3[1].problemsSolved} solved</div>
                  </div>
                </motion.div>
              )}

              {/* 1st Place */}
              {top3[0] && (
                <motion.div
                  className="flex-1 max-w-xs"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-center mb-4">
                    <div className="relative inline-block">
                      <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getMedalColor(1)} flex items-center justify-center text-white font-bold text-3xl shadow-2xl mb-3`}>
                        {top3[0].username.charAt(0).toUpperCase()}
                      </div>
                      <Trophy className="absolute -top-2 -right-2 text-yellow-500" size={24} />
                    </div>
                    <h3 className="font-bold text-xl truncate">{top3[0].username}</h3>
                    <p className="text-sm text-text-secondary font-medium">{top3[0].rating} rating</p>
                  </div>
                  <div className={`${getPodiumHeight(1)} bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-t-2xl flex flex-col items-center justify-center shadow-2xl relative`}>
                    <Trophy className="text-yellow-500 mb-2" size={40} />
                    <div className="text-4xl font-bold text-yellow-600">#1</div>
                    <div className="text-sm text-yellow-600 mt-1 font-medium">{top3[0].problemsSolved} solved</div>
                  </div>
                </motion.div>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <motion.div
                  className="flex-1 max-w-xs"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-center mb-4">
                    <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${getMedalColor(3)} flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-3`}>
                      {top3[2].username.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-semibold text-lg truncate">{top3[2].username}</h3>
                    <p className="text-sm text-text-secondary">{top3[2].rating} rating</p>
                  </div>
                  <div className={`${getPodiumHeight(3)} bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-800 dark:to-orange-900 rounded-t-2xl flex flex-col items-center justify-center shadow-xl relative`}>
                    <Award className="text-orange-500 mb-2" size={32} />
                    <div className="text-3xl font-bold text-orange-500">#3</div>
                    <div className="text-sm text-orange-500 mt-1">{top3[2].problemsSolved} solved</div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Rest of Leaderboard */}
        {rest.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4">All Rankings</h2>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-dark-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Problems Solved
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-dark-800">
                    {rest.map((entry, index) => (
                      <motion.tr
                        key={entry.id}
                        className="hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                      >
                        <td className="px-6 py-4">
                          <span className="font-bold text-lg text-accent">#{entry.rank}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white font-semibold">
                              {entry.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-gray-100">
                                {entry.username}
                              </div>
                              {entry.fullName && (
                                <div className="text-sm text-text-secondary">{entry.fullName}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-accent text-lg">{entry.rating}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {entry.problemsSolved}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <TrendingUp className="text-success" size={20} />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {leaderboard.length === 0 && !loading && (
          <div className="text-center py-16">
            <Trophy className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-2xl font-bold mb-2">No Rankings Yet</h3>
            <p className="text-text-secondary">Start solving problems to appear on the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
