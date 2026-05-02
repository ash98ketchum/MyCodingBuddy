import { create } from 'zustand';
import { adminApi } from '../services/adminAuthApi'; // Utilize existing authorized axios instance

interface Segment {
    name: string;
    value: number;
    color: string;
}

interface PerformancePoint {
    date: string;
    assigned: number;
    solved: number;
}

export interface CollegeDashboardState {
    collegeId: string | null;
    isLoading: boolean;
    error: string | null;

    overview: {
        totalStudents: number;
        activeToday: number;
        solvedToday: number;
        avgSolveRate: number;
        integrityScore: number;
        avgCodeQuality: string;
    } | null;

    performance: {
        solveRateData: PerformancePoint[];
        avgExecutionTime: number;
        avgAttempts: number;
    } | null;

    segmentation: {
        segments: Segment[];
    } | null;

    integrity: {
        honestRatio: number;
        suspiciousRatio: number;
        totalFlagged: number;
        flagsByType: { type: string, count: number }[];
    } | null;

    problems: {
        mostSolved: { problemId: string, attempts: number, solves: number, solveRate: number }[];
        leastSolved: { problemId: string, attempts: number, solves: number, solveRate: number }[];
    } | null;

    leaderboard: {
        studentId: string;
        name: string;
        email: string;
        problemsSolved: number;
        score: number;
    }[] | null;

    setCollegeId: (id: string) => void;
    fetchAll: (id: string) => Promise<void>;
}

export const useCollegeDashboardStore = create<CollegeDashboardState>((set) => ({
    collegeId: null,
    isLoading: false,
    error: null,

    overview: null,
    performance: null,
    segmentation: null,
    integrity: null,
    problems: null,
    leaderboard: null,

    setCollegeId: (id: string) => set({ collegeId: id }),

    fetchAll: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            // Fetch everything concurrently for maximum speed
            const [overview, performance, segmentation, integrity, problems, leaderboard] = await Promise.all([
                adminApi.api.get(`/admin/college/${id}/overview`),
                adminApi.api.get(`/admin/college/${id}/performance`),
                adminApi.api.get(`/admin/college/${id}/student-segmentation`),
                adminApi.api.get(`/admin/college/${id}/integrity`),
                adminApi.api.get(`/admin/college/${id}/problems`),
                adminApi.api.get(`/admin/college/${id}/leaderboard`)
            ]);

            // Assuming adminApi handles `data.data` wrapper automatically like it did for EOD.
            set({
                overview: (overview as any).data || (overview as any),
                performance: (performance as any).data || (performance as any),
                segmentation: (segmentation as any).data || (segmentation as any),
                integrity: (integrity as any).data || (integrity as any),
                problems: (problems as any).data || (problems as any),
                leaderboard: (leaderboard as any).data || (leaderboard as any),
                isLoading: false
            });
        } catch (error: any) {
            console.error('Failed to load dashboard data:', error);
            set({ error: error.message || 'Failed to load college analytics', isLoading: false });
        }
    }
}));
