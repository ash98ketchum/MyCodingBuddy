// frontend/src/services/api.ts
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/** In-flight GET request deduplication cache */
const inFlightRequests = new Map<string, Promise<any>>();

/** Exponential backoff retry for 429 responses */
const retryWithBackoff = async (fn: () => Promise<any>, retries = 3, delay = 500): Promise<any> => {
  try {
    return await fn();
  } catch (err: any) {
    if (retries > 0 && err?.response?.status === 429) {
      await new Promise((res) => setTimeout(res, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw err;
  }
};

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
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError<any>) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || 'Something went wrong';

        if (status === 401) {
          // Only hard-redirect to login if we are NOT on an admin route
          const isAdminRoute = window.location.pathname.startsWith('/admin');
          if (!isAdminRoute) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Use replace to avoid polluting browser history
            window.location.replace('/login');
            toast.error('Session expired. Please login again.');
          }
        } else if (status === 429) {
          // Silently handle 429 — retryWithBackoff will catch this upstream;
          // only show toast if it's a mutation (non-GET)
          const method = error.config?.method?.toUpperCase();
          if (method && method !== 'GET') {
            toast.error('Too many requests. Please wait a moment and try again.');
          }
        } else if (status && status >= 500) {
          toast.error('Server error. Please try again later.');
        } else if (status !== 404) {
          // Suppress 404s from polluting toasts — callers handle those
          toast.error(message);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Deduplicated GET — if the same URL is already in flight, reuse the
   * existing Promise instead of firing a second request.
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const cacheKey = url + JSON.stringify(config?.params ?? {});
    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey) as Promise<T>;
    }
    const promise = retryWithBackoff(() => this.api.get<T, T>(url, config)).finally(() => {
      inFlightRequests.delete(cacheKey);
    });
    inFlightRequests.set(cacheKey, promise);
    return promise;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.post<T, T>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.put<T, T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.delete<T, T>(url, config);
  }

  // Auth
  async register(data: any) {
    return this.api.post('/auth/register', data);
  }

  async login(data: any) {
    return this.api.post('/auth/login', data);
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  async updateProfile(data: any) {
    return this.api.put('/auth/profile', data);
  }

  // Problems
  async getProblems(params?: any) {
    return this.get('/problems', { params });
  }

  async getProblem(slug: string) {
    return this.get(`/problems/${slug}`);
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
    return this.get('/problems/stats');
  }

  async getGlobalStats() {
    return this.get('/problems/global-stats');
  }

  // Discussion Module APIs
  async getDiscussions(params?: {
    page?: number;
    limit?: number;
    problemId?: string;
    tags?: string;
    sort?: 'recent' | 'popular' | 'unanswered';
  }) {
    return this.get('/discussions', { params });
  }

  async getDiscussionById(id: string) {
    return this.get(`/discussions/${id}`);
  }

  async createDiscussion(data: {
    title: string;
    content: string;
    problemId?: string;
    tags?: string;
  }) {
    return this.api.post('/discussions', data);
  }

  async updateDiscussion(id: string, data: { title: string; content: string; tags?: string }) {
    return this.api.put(`/discussions/${id}`, data);
  }

  async deleteDiscussion(id: string) {
    return this.api.delete(`/discussions/${id}`);
  }

  async createComment(data: {
    discussionId: string;
    content: string;
    parentId?: string;
  }) {
    return this.api.post(`/discussions/${data.discussionId}/comments`, data);
  }

  async updateComment(id: string, content: string) {
    return this.api.put(`/comments/${id}`, { content });
  }

  async deleteComment(id: string) {
    return this.api.delete(`/comments/${id}`);
  }

  async markAsAccepted(id: string) {
    return this.api.post(`/comments/${id}/accept`);
  }

  async toggleReaction(data: { emoji: string; discussionId?: string; commentId?: string }) {
    return this.api.post('/reactions', data);
  }

  async getReactions(params: { discussionId?: string; commentId?: string }) {
    return this.get('/reactions', { params });
  }

  async vote(data: { type: 'UP' | 'DOWN'; discussionId?: string; commentId?: string }) {
    return this.api.post('/vote', data);
  }

  async removeVote(data: { discussionId?: string; commentId?: string }) {
    return this.api.delete('/vote', { data });
  }

  // Submissions
  async submitCode(data: any) {
    return this.api.post('/submissions', data);
  }

  async getSubmission(id: string) {
    return this.get(`/submissions/${id}`);
  }

  async getUserSubmissions(params?: any) {
    return this.get('/submissions/my', { params });
  }

  async getSubmissionStatus(id: string) {
    // Submission status polling — NOT deduplicated intentionally (each poll is unique)
    return this.api.get(`/submissions/${id}/status`);
  }

  async getLeaderboard(params?: any) {
    return this.get('/submissions/leaderboard', { params });
  }

  // Admin
  async getDashboardStats() {
    return this.get('/admin/dashboard');
  }

  async getAllUsers(params?: any) {
    return this.get('/admin/users', { params });
  }

  async updateUser(id: string, data: any) {
    return this.api.put(`/admin/users/${id}`, data);
  }

  async deleteUser(id: string) {
    return this.api.delete(`/admin/users/${id}`);
  }

  async getAllSubmissions(params?: any) {
    return this.get('/admin/submissions', { params });
  }

  async createAdminUser(data: any) {
    return this.api.post('/admin/create-admin', data);
  }

  async getSystemHealth() {
    return this.get('/admin/health');
  }
}

export const api = new ApiService();
export default api;
