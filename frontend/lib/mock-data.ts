// Mock data for the platform
export const mockUser = {
  id: '1',
  username: 'codewizard',
  name: 'Alex Thompson',
  email: 'alex@codingbuddy.com',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  hearts: 89,
  rating: 2156,
  rank: 'Expert',
  streak: 15,
  totalSolved: 456,
  githubUsername: 'alexthompson',
  codeforcesRating: 1847,
  codechefRating: 1923,
  leetcodeRating: 2089
};

export const mockContests = [
  {
    id: '1',
    title: 'Weekly Algorithm Challenge #42',
    description: 'Test your skills with dynamic programming and graph algorithms',
    participants: 1247,
    duration: '2 hours',
    startTime: '2025-01-15T18:00:00Z',
    difficulty: 'Medium',
    problems: 6,
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Speed Coding Sprint',
    description: 'Fast-paced problem solving with implementation challenges',
    participants: 856,
    duration: '90 minutes',
    startTime: '2025-01-12T15:00:00Z',
    difficulty: 'Easy',
    problems: 4,
    status: 'live'
  },
  {
    id: '3',
    title: 'Mathematical Algorithms Masterclass',
    description: 'Advanced number theory and combinatorics problems',
    participants: 623,
    duration: '3 hours',
    startTime: '2025-01-10T12:00:00Z',
    difficulty: 'Hard',
    problems: 8,
    status: 'completed'
  }
];

export const mockLeaderboard = [
  {
    rank: 1,
    username: 'algorithmaster',
    name: 'Sarah Chen',
    rating: 2847,
    hearts: 156,
    totalSolved: 892,
    avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    rank: 2,
    username: 'codewizard',
    name: 'Alex Thompson',
    rating: 2156,
    hearts: 89,
    totalSolved: 456,
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    rank: 3,
    username: 'debugninja',
    name: 'Marcus Johnson',
    rating: 2098,
    hearts: 134,
    totalSolved: 723,
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    rank: 4,
    username: 'pythonista',
    name: 'Elena Rodriguez',
    rating: 1967,
    hearts: 92,
    totalSolved: 534,
    avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    rank: 5,
    username: 'datastructure',
    name: 'Ryan Kim',
    rating: 1876,
    hearts: 76,
    totalSolved: 398,
    avatar: 'https://images.pexels.com/photos/2741701/pexels-photo-2741701.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  }
];

export const mockRatingHistory = [
  { month: 'Jan', rating: 1200 },
  { month: 'Feb', rating: 1350 },
  { month: 'Mar', rating: 1420 },
  { month: 'Apr', rating: 1380 },
  { month: 'May', rating: 1650 },
  { month: 'Jun', rating: 1789 },
  { month: 'Jul', rating: 1834 },
  { month: 'Aug', rating: 1923 },
  { month: 'Sep', rating: 2001 },
  { month: 'Oct', rating: 2089 },
  { month: 'Nov', rating: 2156 }
];

export const mockProblems = [
  {
    id: 'A',
    title: 'Binary Tree Maximum Path Sum',
    difficulty: 'Hard',
    points: 1000,
    solved: 234,
    total: 567
  },
  {
    id: 'B',
    title: 'Dynamic Programming Optimization',
    difficulty: 'Medium',
    points: 750,
    solved: 445,
    total: 567
  },
  {
    id: 'C',
    title: 'Graph Traversal Challenge',
    difficulty: 'Easy',
    points: 500,
    solved: 512,
    total: 567
  }
];