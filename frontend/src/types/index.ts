// frontend/src/types/index.ts
export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  role: 'USER' | 'ADMIN';
  planType: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  rating: number;
  streak: number;
  avatar?: string;
  bio?: string;
  country?: string;
  organization?: string;
  isPremium: boolean;
  createdAt: string;
  solvedStats?: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  rating: number;
  tags: string[];
  sampleInput: string;
  sampleOutput: string;
  explanation?: string;
  constraints?: string;
  timeLimit: number;
  memoryLimit: number;
  isFree: boolean;
  isPremium: boolean;
  acceptedCount: number;
  submissionCount: number;
  createdAt: string;
  testCases?: TestCase[];
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSample: boolean;
  isHidden: boolean;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: Language;
  verdict: Verdict;
  executionTime?: number;
  memoryUsed?: number;
  score: number;
  testCasesPassed: number;
  totalTestCases: number;
  errorMessage?: string;
  testResults?: any;
  createdAt: string;
  problem?: {
    id: string;
    title: string;
    slug: string;
    difficulty: string;
  };
  user?: {
    id: string;
    username: string;
  };
}

export type Language = 'JAVASCRIPT' | 'PYTHON' | 'JAVA' | 'CPP' | 'C';

export type Verdict =
  | 'QUEUED'
  | 'PENDING'
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'RUNTIME_ERROR'
  | 'COMPILATION_ERROR';

export interface Contest {
  id: string;
  title: string;
  slug: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration: number;
  isPublic: boolean;
  isPremium: boolean;
  ratingChange: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  fullName?: string;
  rating: number;
  country?: string;
  avatar?: string;
  problemsSolved: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalProblems: number;
  totalSubmissions: number;
  totalContests: number;
  premiumUsers: number;
  revenue: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

// export interface PaginatedResponse<T> {
//   success: boolean;
//   data: T[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     pages: number;
//   };
// }

// Discussion Module Types
export interface Discussion {
  id: string;
  title: string;
  content: string;
  userId: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
    rating?: number;
  };
  problemId?: string;
  problem?: {
    id: string;
    title: string;
    slug: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  };
  tags: string;
  upvotes: number;
  downvotes: number;
  viewCount: number;
  isPinned: boolean;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
  reactions?: Reaction[];
  votes?: Vote[];
  _count?: {
    comments: number;
    reactions: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
    rating?: number;
  };
  discussionId: string;
  parentId?: string;
  replies?: Comment[];
  upvotes: number;
  downvotes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  reactions?: Reaction[];
  votes?: Vote[];
}

export interface Reaction {
  id: string;
  emoji: string;
  userId: string;
  user: {
    id: string;
    username: string;
  };
  discussionId?: string;
  commentId?: string;
  createdAt: string;
}

export interface Vote {
  id: string;
  type: 'UP' | 'DOWN';
  userId: string;
  discussionId?: string;
  commentId?: string;
  createdAt: string;
}
