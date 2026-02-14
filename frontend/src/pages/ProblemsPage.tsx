// frontend/src/pages/ProblemsPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Problem } from '@/types';
import api from '@/services/api';
import { Search, Filter, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge, Skeleton, Input } from '../components/ui';

const ProblemsPage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'difficulty' | 'acceptance'>('title');

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const response = await api.getProblems();
      setProblems(response.data.problems);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort problems
  const filteredProblems = problems
    .filter((problem) => {
      const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty =
        selectedDifficulty === 'all' || problem.difficulty.toLowerCase() === selectedDifficulty;
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'difficulty') {
        const difficultyOrder = { EASY: 1, MEDIUM: 2, HARD: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      }
      if (sortBy === 'acceptance') {
        const acceptanceA = (a.acceptedCount / a.submissionCount) * 100 || 0;
        const acceptanceB = (b.acceptedCount / b.submissionCount) * 100 || 0;
        return acceptanceB - acceptanceA;
      }
      return 0;
    });

  const difficulties = [
    { value: 'all', label: 'All', count: problems.length },
    { value: 'easy', label: 'Easy', count: problems.filter((p) => p.difficulty === 'EASY').length },
    { value: 'medium', label: 'Medium', count: problems.filter((p) => p.difficulty === 'MEDIUM').length },
    { value: 'hard', label: 'Hard', count: problems.filter((p) => p.difficulty === 'HARD').length },
  ];

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="mb-8">
          <Skeleton variant="text" className="h-10 w-48 mb-4" />
          <Skeleton variant="text" className="h-6 w-96" />
        </div>

        <div className="flex gap-4 mb-6">
          <Skeleton variant="rectangular" className="h-12 flex-1 max-w-md" />
          <Skeleton variant="rectangular" className="h-12 w-32" />
        </div>

        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2">
            Problem Set
          </h1>
          <p className="text-text-secondary text-lg">
            Master {problems.length} coding challenges across all difficulty levels
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search problems..."
                leftIcon={<Search size={18} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent focus:outline-none transition-colors bg-white"
            >
              <option value="title">Sort by Title</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="acceptance">Sort by Acceptance</option>
            </select>
          </div>

          {/* Difficulty Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                onClick={() => setSelectedDifficulty(diff.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${selectedDifficulty === diff.value
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
              >
                {diff.label} ({diff.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card p-4">
            <div className="text-2xl font-bold text-accent">{problems.length}</div>
            <div className="text-sm text-text-secondary">Total Problems</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-success">
              {problems.filter((p) => p.difficulty === 'EASY').length}
            </div>
            <div className="text-sm text-text-secondary">Easy</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-warning">
              {problems.filter((p) => p.difficulty === 'MEDIUM').length}
            </div>
            <div className="text-sm text-text-secondary">Medium</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-error">
              {problems.filter((p) => p.difficulty === 'HARD').length}
            </div>
            <div className="text-sm text-text-secondary">Hard</div>
          </div>
        </motion.div>

        {/* Problems List */}
        <div className="space-y-3">
          {filteredProblems.length === 0 ? (
            <div className="card p-12 text-center">
              <Filter className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-semibold mb-2">No Problems Found</h3>
              <p className="text-text-secondary">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filteredProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/problems/${problem.slug}`}>
                  <div className="card-hover p-5 group">
                    <div className="flex items-center justify-between gap-4">
                      {/* Problem Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-accent transition-colors truncate">
                            {problem.title}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
                          <Badge variant={problem.difficulty.toLowerCase() as any}>
                            {problem.difficulty}
                          </Badge>
                          {problem.tags && typeof problem.tags === 'string' && problem.tags.split(',').filter(Boolean).map((tag) => (
                            <Badge key={tag.trim()} variant="tag">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="hidden md:flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-text-secondary">
                            <TrendingUp size={16} />
                            <span className="font-medium">
                              {((problem.acceptedCount / problem.submissionCount) * 100 || 0).toFixed(1)}%
                            </span>
                          </div>
                          <div className="text-xs text-text-tertiary">Acceptance</div>
                        </div>

                        <div className="text-center">
                          <div className="font-medium text-text-secondary">
                            {problem.submissionCount || 0}
                          </div>
                          <div className="text-xs text-text-tertiary">Submissions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>

        {/* Results count */}
        <div className="mt-6 text-center text-sm text-text-secondary">
          Showing {filteredProblems.length} of {problems.length} problems
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;
