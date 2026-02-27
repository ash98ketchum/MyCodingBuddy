// frontend/src/store/index.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Submission } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

interface EditorState {
  code: string;
  language: string;
  theme: string;
  fontSize: number;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setFontSize: (size: number) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      code: '',
      language: 'JAVASCRIPT',
      theme: 'vs-dark',
      fontSize: 14,
      setCode: (code) => set({ code }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      reset: () => set({ code: '', language: 'JAVASCRIPT' }),
    }),
    {
      name: 'editor-storage',
    }
  )
);

// ── Problem workspace store ───────────────────────────────────────────────────
type LeftTab = 'description' | 'submissions' | 'results';

interface ProblemState {
  // Code persisted per "slug:language" key
  codeMap: Record<string, string>;
  setCodeForKey: (key: string, code: string) => void;
  getCodeForKey: (key: string) => string;

  activeLeftTab: LeftTab;
  setActiveLeftTab: (tab: LeftTab) => void;

  latestResult: Submission | null;
  setLatestResult: (result: Submission | null) => void;

  // Width of the left panel (% of total)
  leftPanelWidth: number;
  setLeftPanelWidth: (w: number) => void;
}

export const useProblemStore = create<ProblemState>()(
  persist(
    (set, get) => ({
      codeMap: {},
      setCodeForKey: (key, code) =>
        set((s) => ({ codeMap: { ...s.codeMap, [key]: code } })),
      getCodeForKey: (key) => get().codeMap[key] ?? '',

      activeLeftTab: 'description',
      setActiveLeftTab: (tab) => set({ activeLeftTab: tab }),

      latestResult: null,
      setLatestResult: (result) => set({ latestResult: result }),

      leftPanelWidth: 42,
      setLeftPanelWidth: (w) => set({ leftPanelWidth: w }),
    }),
    {
      name: 'problem-workspace',
      // Only persist layout + code, NOT transient result
      partialize: (s) => ({
        codeMap: s.codeMap,
        leftPanelWidth: s.leftPanelWidth,
      }),
    }
  )
);
