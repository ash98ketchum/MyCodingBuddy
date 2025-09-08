'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { FloatingBackground } from '@/components/ui/floating-background'
import { Sidebar } from '@/components/sidebar'
import { mockUser } from '@/lib/mock-data'
import { useTheme } from 'next-themes'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Github,
  Mail,
  Lock,
  Save,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import { useState } from 'react'

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: mockUser.name,
    username: mockUser.username,
    email: mockUser.email,
    bio: 'Passionate competitive programmer and algorithm enthusiast.',
    notifications: {
      contests: true,
      achievements: true,
      mentions: false,
      newsletter: true
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showStats: true
    }
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ]

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor }
  ]

  const handleSave = () => {
    // Mock save functionality
    alert('Settings saved successfully!')
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
              <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">Settings</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and privacy settings</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64">
              <GlassCard delay={0.1}>
                <nav className="space-y-2">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <motion.button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-left ${
                        activeTab === id
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-600 dark:text-cyan-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </motion.button>
                  ))}
                </nav>
              </GlassCard>
            </div>

            {/* Content */}
            <div className="flex-1">
              <GlassCard delay={0.2}>
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold">Profile Settings</h2>
                      <motion.button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </motion.button>
                    </div>

                    <div className="flex items-center space-x-6 mb-6">
                      <img
                        src={mockUser.avatar}
                        alt="Profile"
                        className="w-20 h-20 rounded-full border-2 border-cyan-400"
                      />
                      <div>
                        <h3 className="font-semibold mb-2">Profile Photo</h3>
                        <div className="flex space-x-2">
                          <motion.button
                            className="px-3 py-2 bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
                            whileHover={{ scale: 1.02 }}
                          >
                            Change Photo
                          </motion.button>
                          <motion.button
                            className="px-3 py-2 bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                            whileHover={{ scale: 1.02 }}
                          >
                            Remove
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                          className="w-full px-3 py-2 bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3 py-2 bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Bio</label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          className="w-full px-3 py-2 bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 h-24 resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Connected Accounts</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/10 dark:bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Github className="w-5 h-5" />
                            <span>GitHub</span>
                          </div>
                          <motion.button
                            className="px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded text-sm"
                            whileHover={{ scale: 1.05 }}
                          >
                            Connected
                          </motion.button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-white/10 dark:bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                              <span className="text-white text-xs font-bold">CF</span>
                            </div>
                            <span>Codeforces</span>
                          </div>
                          <motion.button
                            className="px-3 py-1 bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded text-sm"
                            whileHover={{ scale: 1.05 }}
                          >
                            Connect
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-6">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Contest Notifications</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about upcoming contests and results</p>
                        </div>
                        <motion.button
                          onClick={() => setFormData({
                            ...formData,
                            notifications: { ...formData.notifications, contests: !formData.notifications.contests }
                          })}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            formData.notifications.contests ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                            formData.notifications.contests ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </motion.button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Achievement Notifications</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when you earn new achievements</p>
                        </div>
                        <motion.button
                          onClick={() => setFormData({
                            ...formData,
                            notifications: { ...formData.notifications, achievements: !formData.notifications.achievements }
                          })}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            formData.notifications.achievements ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                            formData.notifications.achievements ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-6">Appearance Settings</h2>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Theme</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {themeOptions.map(({ id, label, icon: Icon }) => (
                          <motion.button
                            key={id}
                            onClick={() => setTheme(id)}
                            className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                              theme === id
                                ? 'border-cyan-500 bg-cyan-500/10'
                                : 'border-white/20 dark:border-gray-700 bg-white/10 dark:bg-white/5'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Icon className="w-6 h-6" />
                            <span className="font-medium">{label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-6">Privacy Settings</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Public Profile</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Make your profile visible to other users</p>
                        </div>
                        <motion.button
                          onClick={() => setFormData({
                            ...formData,
                            privacy: { ...formData.privacy, profileVisible: !formData.privacy.profileVisible }
                          })}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            formData.privacy.profileVisible ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                            formData.privacy.profileVisible ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </motion.button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Show Statistics</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Display your coding statistics publicly</p>
                        </div>
                        <motion.button
                          onClick={() => setFormData({
                            ...formData,
                            privacy: { ...formData.privacy, showStats: !formData.privacy.showStats }
                          })}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            formData.privacy.showStats ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                            formData.privacy.showStats ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}