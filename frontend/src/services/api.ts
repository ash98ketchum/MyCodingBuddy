import axios, { AxiosInstance, AxiosError } from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

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
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError<any>) => {
        const message = error.response?.data?.message || 'Something went wrong';
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
        } else {
          toast.error(message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async register(data: any) {
    return this.api.post('/auth/register', data);
  }

  async login(data: any) {
    return this.api.post('/auth/login', data);
  }

  async getProfile() {
    return this.api.get('/auth/profile');
  }

  async updateProfile(data: any) {
    return this.api.put('/auth/profile', data);
  }

  // Problems
  async getProblems(params?: any) {
    return this.api.get('/problems', { params });
  }

  async getProblem(slug: string) {
    return this.api.get(`/problems/${slug}`);
  }

  async createProblem(data: any) {
    return this.api.post('/problems', data);
  }

  async updateProblem(id: string, data: any) {
    return this.api.put(`/problems/${id}`, data);
  }

  async deleteProblem(id: string) {
    return this.api.delete(`/problems/${id}`);
  }

  async getProblemStats() {
    return this.api.get('/problems/stats');
  }

  // Submissions
  async submitCode(data: any) {
    return this.api.post('/submissions', data);
  }

  async getSubmission(id: string) {
    return this.api.get(`/submissions/${id}`);
  }

  async getUserSubmissions(params?: any) {
    return this.api.get('/submissions/my', { params });
  }

  async getSubmissionStatus(id: string) {
    return this.api.get(`/submissions/${id}/status`);
  }

  async getLeaderboard(params?: any) {
    return this.api.get('/submissions/leaderboard', { params });
  }

  // Admin
  async getDashboardStats() {
    return this.api.get('/admin/dashboard');
  }

  async getAllUsers(params?: any) {
    return this.api.get('/admin/users', { params });
  }

  async updateUser(id: string, data: any) {
    return this.api.put(`/admin/users/${id}`, data);
  }

  async deleteUser(id: string) {
    return this.api.delete(`/admin/users/${id}`);
  }

  async getAllSubmissions(params?: any) {
    return this.api.get('/admin/submissions', { params });
  }

  async createAdminUser(data: any) {
    return this.api.post('/admin/create-admin', data);
  }

  async getSystemHealth() {
    return this.api.get('/admin/health');
  }
}

export const api = new ApiService();
export default api;
