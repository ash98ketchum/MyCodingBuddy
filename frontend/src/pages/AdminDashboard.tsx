// frontend/src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { DashboardStats } from '@/types';
import { Users, FileCode, Trophy, DollarSign, School, Activity, ShieldCheck, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardData {
  stats: DashboardStats;
  recentSubmissions: any[];
  recentColleges: any[];
  recentUsers: any[];
}

const AdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.getDashboardStats();
      setData(response.data);
    } catch (error) {
      console.error('Failed to load stats');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {data && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold">{data.stats.totalUsers}</p>
                </div>
                <Users className="text-primary-600" size={32} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Colleges</p>
                  <p className="text-2xl font-bold">{data.stats.totalColleges}</p>
                </div>
                <School className="text-blue-600" size={32} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Problems</p>
                  <p className="text-2xl font-bold">{data.stats.totalProblems}</p>
                </div>
                <FileCode className="text-green-600" size={32} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Submissions</p>
                  <p className="text-2xl font-bold">{data.stats.totalSubmissions}</p>
                </div>
                <Trophy className="text-yellow-600" size={32} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="text-2xl font-bold">${data.stats.revenue}</p>
                </div>
                <DollarSign className="text-purple-600" size={32} />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Colleges Panel */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card p-6 overflow-hidden">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <ShieldCheck className="text-accent" />
                <h2 className="text-xl font-bold">Recent College Onboardings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">College</th>
                      <th className="px-4 py-3">Domain</th>
                      <th className="px-4 py-3 text-right">Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentColleges?.map(college => (
                      <tr key={college.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium">{college.name}</td>
                        <td className="px-4 py-3 text-gray-500">{college.domain || 'N/A'}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${college.subscriptionPlan === 'PREMIUM' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                            {college.subscriptionPlan}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Recent Signups Panel */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="card p-6 overflow-hidden">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <Users className="text-primary-600" />
                <h2 className="text-xl font-bold">Recent Signups</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3 text-right">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentUsers?.map(u => (
                      <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">{u.username}</td>
                        <td className="px-4 py-3 text-gray-500 truncate max-w-[150px]">{u.email}</td>
                        <td className="px-4 py-3 text-right text-gray-500 whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Activity Feed */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <Activity className="text-green-600" />
              <h2 className="text-xl font-bold">Live Activity Feed</h2>
            </div>
            <div className="space-y-4">
              {data.recentSubmissions?.map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{sub.user.username}</span>
                    <span className="text-sm text-gray-500">submitted a solution for {sub.problem.title}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${sub.verdict === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {sub.verdict}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
