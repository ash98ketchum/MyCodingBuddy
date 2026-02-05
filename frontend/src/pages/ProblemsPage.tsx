import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Problem } from '@/types';
import api from '@/services/api';
import { Loader } from 'lucide-react';

const ProblemsPage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Problems</h1>
      
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acceptance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-800">
            {problems.map((problem) => (
              <tr key={problem.id} className="hover:bg-gray-50 dark:hover:bg-dark-800">
                <td className="px-6 py-4">
                  <Link to={`/problems/${problem.slug}`} className="text-primary-600 hover:text-primary-700 font-medium">
                    {problem.title}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {((problem.acceptedCount / problem.submissionCount) * 100 || 0).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemsPage;
