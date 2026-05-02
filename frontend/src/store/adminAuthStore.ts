import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AdminAuthState {
    admin: User | null;
    token: string | null;
    isAuthenticated: boolean;
    activeCollegeId: string | null;
    setAuth: (user: User, token: string) => void;
    setActiveCollege: (collegeId: string | null) => void;
    logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
    persist(
        (set) => ({
            admin: null,
            token: null,
            isAuthenticated: false,
            activeCollegeId: null,
            setAuth: (user, token) => {
                // Validate it's actually an admin
                if (user.role === 'ADMIN') {
                    set({ admin: user, token, isAuthenticated: true });
                } else {
                    console.error("Attempted to set non-admin user in adminAuthStore");
                }
            },
            setActiveCollege: (collegeId) => {
                set({ activeCollegeId: collegeId });
            },
            logout: () => {
                set({ admin: null, token: null, isAuthenticated: false, activeCollegeId: null });
            },
        }),
        {
            name: 'admin-storage', // Use a separate storage key!
        }
    )
);
