import axios, { AxiosInstance, AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useAdminAuthStore } from '../store/adminAuthStore';

// @ts-ignore: Vite env var
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AdminAuthApiService {
    public api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor
        this.api.interceptors.request.use(
            (config) => {
                // Read directly from localStorage to guarantee freshness across tabs
                const adminStorage = localStorage.getItem('admin-storage');
                if (adminStorage) {
                    try {
                        const parsed = JSON.parse(adminStorage);
                        if (parsed.state?.token) {
                            config.headers.Authorization = `Bearer ${parsed.state.token}`;
                        }
                    } catch (e) {
                        console.error("Failed to parse admin storage", e);
                    }
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.api.interceptors.response.use(
            (response) => {
                // The backend returns { success: true, data: { user, token }, message: ... }
                // So response.data is that object. We return response.data to match regular api.ts
                return response.data;
            },
            (error: AxiosError<any>) => {
                const message = error.response?.data?.message || 'Something went wrong';

                if (error.response?.status === 401) {
                    useAdminAuthStore.getState().logout();
                    window.location.href = '/admin/login';
                    toast.error('Admin session expired. Please login again.');
                } else {
                    // Don't toast on initial load check errors to avoid spam
                    if (error.config?.url !== '/auth/profile') {
                        toast.error(message);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    async login(data: any) {
        return this.api.post('/auth/login', data);
    }

    async getProfile() {
        return this.api.get('/auth/profile');
    }

    // Add more admin-specific API calls here later if they need the isolated token
}

export const adminApi = new AdminAuthApiService();
export default adminApi;
