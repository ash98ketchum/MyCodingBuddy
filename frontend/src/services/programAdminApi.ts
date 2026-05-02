import { adminApi } from './adminAuthApi';

export const programAdminApi = {
    getBloomFilter: async () => {
        // adminApi is an Axios instance, it relies on its interceptors to return response.data
        const response = await adminApi.api.get('/admin/program/bloom');
        return response.data;
    },

    verifyStudent: async (email: string) => {
        const response = await adminApi.api.get('/admin/program/students/verify', { params: { email } });
        return response.data;
    },

    getProblems: async () => {
        const response = await adminApi.api.get('/admin/program/problems');
        return response.data;
    },

    assignProblem: async (payload: { studentId: string; problemId: string }) => {
        const response = await adminApi.api.post('/admin/program/assign', payload);
        return response; // Success string/data is returned
    }
};
