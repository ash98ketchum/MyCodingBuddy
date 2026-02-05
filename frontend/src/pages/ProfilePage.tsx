import React from 'react';
import { useAuthStore } from '@/store';

const ProfilePage = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <div className="card p-8">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Username</label>
            <p className="text-lg">{user?.username}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Rating</label>
            <p className="text-lg font-bold text-primary-600">{user?.rating}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
