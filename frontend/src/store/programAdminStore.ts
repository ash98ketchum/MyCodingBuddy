import { create } from 'zustand';
import { programAdminApi } from '../services/programAdminApi';
import toast from 'react-hot-toast';

export interface ProblemPreview {
    id: string;
    title: string;
    difficulty: string;
    rating: number;
    tags: string[];
}

export interface StudentPreview {
    id: string;
    email: string;
    name: string;
    programId: string;
}

interface BloomFilterData {
    filter: string; // Hex string
    bitSize: number;
    hashCount: number;
}

interface ProgramAdminState {
    bloomData: BloomFilterData | null;
    problems: ProblemPreview[];
    selectedStudent: StudentPreview | null;
    selectedProblem: string | null;

    // Status flags
    isFetchingInitial: boolean;
    isAssigning: boolean;
    assignSuccess: boolean;

    // Actions
    fetchInitialData: () => Promise<void>;
    verifyStudentExact: (email: string) => Promise<StudentPreview | null>;
    setSelectedProblem: (problemId: string | null) => void;
    setSelectedStudent: (student: StudentPreview | null) => void;
    assignProblem: () => Promise<boolean>;
    resetAssignmentState: () => void;
}

export const useProgramAdminStore = create<ProgramAdminState>((set, get) => ({
    bloomData: null,
    problems: [],
    selectedStudent: null,
    selectedProblem: null,

    isFetchingInitial: false,
    isAssigning: false,
    assignSuccess: false,

    fetchInitialData: async () => {
        const { isFetchingInitial } = get();
        if (isFetchingInitial) return;

        set({ isFetchingInitial: true });
        try {
            const [bloomRes, problemsRes] = await Promise.all([
                programAdminApi.getBloomFilter(),
                programAdminApi.getProblems()
            ]);

            set({
                bloomData: bloomRes,
                problems: problemsRes || [],
                isFetchingInitial: false
            });
        } catch (error) {
            console.error("Failed to fetch initial admin program data:", error);
            toast.error("Failed to load program data.");
            set({ isFetchingInitial: false });
        }
    },

    verifyStudentExact: async (email: string) => {
        try {
            const res = await programAdminApi.verifyStudent(email);
            return res; // StudentPreview or null
        } catch (error) {
            console.error("Exact verify failed:", error);
            return null;
        }
    },

    setSelectedProblem: (problemId) => set({ selectedProblem: problemId }),
    setSelectedStudent: (student) => set({ selectedStudent: student }),

    assignProblem: async () => {
        const { selectedStudent, selectedProblem } = get();
        if (!selectedStudent || !selectedProblem) return false;

        set({ isAssigning: true, assignSuccess: false });
        try {
            await programAdminApi.assignProblem({
                studentId: selectedStudent.id,
                problemId: selectedProblem
            });
            set({ isAssigning: false, assignSuccess: true, selectedStudent: null, selectedProblem: null });
            toast.success("Problem assigned successfully");
            return true;
        } catch (error: any) {
            set({ isAssigning: false });
            // Error is handled/toasted by the interceptor mostly, but we can do extra here
            return false;
        }
    },

    resetAssignmentState: () => set({ assignSuccess: false })
}));
