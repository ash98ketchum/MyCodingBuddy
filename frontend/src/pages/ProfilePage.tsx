// frontend/src/pages/ProfilePage.tsx
import React from 'react';
import { useAuthStore } from '@/store';
import { Trophy, TrendingUp, Award, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge, Card } from '../components/ui';

const ProfilePage = () => {
  const { user, setAuth } = useAuthStore();
  const [profileData, setProfileData] = React.useState<any>(null);
  const [recentActivity, setRecentActivity] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { api } = await import('../services/api');

        // Fetch User Profile with Stats
        const profileRes: any = await api.getProfile();
        if (profileRes.success) {
          setProfileData(profileRes.data);
          // Update store if needed, but be careful not to overwrite token
          if (sessionStorage.getItem('token')) {
            setAuth(profileRes.data, sessionStorage.getItem('token')!);
          }
        }

        // Fetch Recent Submissions
        const submissionsRes: any = await api.getUserSubmissions({ limit: 5 });
        if (submissionsRes.success) {
          const activity = submissionsRes.data.submissions.map((sub: any) => ({
            problem: sub.problem.title,
            difficulty: sub.problem.difficulty,
            solvedAt: new Date(sub.createdAt).toLocaleDateString(),
            status: sub.verdict === 'ACCEPTED' ? 'Accepted' : sub.verdict
          }));
          setRecentActivity(activity);
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user?.id]); // specific dependency

  if (loading && !profileData) { // Show loading only if we don't have data yet
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Use profileData from API if available, otherwise fallback to store user (which might be stale but has basic info)
  // The API response `profileData` now includes `solvedStats`
  const displayUser = profileData || user;

  const stats = {
    totalSolved: displayUser?.solvedStats?.total || 0,
    easySolved: displayUser?.solvedStats?.easy || 0,
    mediumSolved: displayUser?.solvedStats?.medium || 0,
    hardSolved: displayUser?.solvedStats?.hard || 0,
    streak: displayUser?.streak || 0,
    ranking: displayUser?.rating || 0, // Using rating as proxy for ranking for now as per plan
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container-custom max-w-6xl">
        {/* User Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="default" className="p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white font-bold text-4xl shadow-xl">
                {displayUser?.username?.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{displayUser?.username}</h1>
                <p className="text-text-secondary mb-4">{displayUser?.email}</p>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="tag">
                    {displayUser?.role === 'ADMIN' ? 'Administrator' : 'Member'}
                  </Badge>
                  <Badge variant="easy">
                    🔥 {stats.streak} Day Streak
                  </Badge>
                </div>
              </div>

              {/* Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-1">{displayUser?.rating}</div>
                <div className="text-sm text-text-secondary">Rating</div>
                <div className="flex items-center gap-1 text-xs text-success mt-1">
                  <TrendingUp size={14} />
                  <span>Rank #{stats.ranking}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="hover" className="p-6 text-center">
            <Trophy className="mx-auto mb-3 text-accent" size={32} />
            <div className="text-3xl font-bold text-accent mb-1">{stats.totalSolved}</div>
            <div className="text-sm text-text-secondary">Total Solved</div>
          </Card>

          <Card variant="hover" className="p-6 text-center">
            <div className="text-3xl font-bold text-success mb-1">{stats.easySolved}</div>
            <div className="text-sm text-text-secondary">Easy</div>
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: `${stats.totalSolved ? (stats.easySolved / stats.totalSolved) * 100 : 0}%` }}></div>
              </div>
            </div>
          </Card>

          <Card variant="hover" className="p-6 text-center">
            <div className="text-3xl font-bold text-warning mb-1">{stats.mediumSolved}</div>
            <div className="text-sm text-text-secondary">Medium</div>
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-warning" style={{ width: `${stats.totalSolved ? (stats.mediumSolved / stats.totalSolved) * 100 : 0}%` }}></div>
              </div>
            </div>
          </Card>

          <Card variant="hover" className="p-6 text-center">
            <div className="text-3xl font-bold text-error mb-1">{stats.hardSolved}</div>
            <div className="text-sm text-text-secondary">Hard</div>
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-error" style={{ width: `${stats.totalSolved ? (stats.hardSolved / stats.totalSolved) * 100 : 0}%` }}></div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar size={28} />
            Recent Activity
          </h2>

          <Card variant="default" className="overflow-hidden">
            <div className="divide-y divide-gray-100">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{activity.problem}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant={activity.difficulty.toLowerCase() as any}>
                            {activity.difficulty}
                          </Badge>
                          <span className="text-text-tertiary">{activity.solvedAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${activity.status === 'Accepted' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                          {activity.status === 'Accepted' ? '✓' : '✖'} {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-text-secondary">
                  No recent activity found. Start solving problems!
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award size={28} />
            Achievements
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🎯', title: 'First Step', desc: 'Solve your first problem' },
              { icon: '🔥', title: 'On Fire', desc: '5 day streak' },
              { icon: '💯', title: 'Century', desc: 'Solve 100 problems' },
              { icon: '⚡', title: 'Speed Demon', desc: 'Solve in under 5 minutes' },
            ].map((achievement, index) => (
              <Card key={index} variant="hover" className="p-4 text-center">
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <div className="font-semibold text-sm mb-1">{achievement.title}</div>
                <div className="text-xs text-text-tertiary">{achievement.desc}</div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
