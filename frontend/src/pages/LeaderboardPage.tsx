import React, { useEffect, useState } from 'react';
import { LeaderboardEntry } from '@/types';
import api from '@/services/api';
import { Trophy, Loader } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="text-yellow-500" size={32} />
        <h1 className="text-3xl font-bold">Leaderboard</h1>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Problems Solved
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-800">
            {leaderboard.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 font-bold text-lg">#{entry.rank}</td>
                <td className="px-6 py-4">
                  <div className="font-medium">{entry.username}</div>
                  {entry.fullName && <div className="text-sm text-gray-500">{entry.fullName}</div>}
                </td>
                <td className="px-6 py-4 font-semibold text-primary-600">{entry.rating}</td>
                <td className="px-6 py-4">{entry.problemsSolved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
