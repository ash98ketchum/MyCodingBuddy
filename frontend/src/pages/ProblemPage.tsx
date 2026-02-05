import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from '@/components/CodeEditor';
import { Problem, Submission } from '@/types';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Clock, Database, CheckCircle, XCircle, Loader } from 'lucide-react';

export const ProblemPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Submission | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description');

  useEffect(() => {
    loadProblem();
  }, [slug]);

  const loadProblem = async () => {
    try {
      setLoading(true);
      const response = await api.getProblem(slug!);
      setProblem(response.data);
    } catch (error) {
      toast.error('Failed to load problem');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (code: string, language: string) => {
    if (!problem) return;

    try {
      setSubmitting(true);
      setResult(null);

      const response = await api.submitCode({
        problemId: problem.id,
        code,
        language,
      });

      const submissionId = response.data.submissionId;
      
      toast.success('Code submitted! Checking...');

      // Poll for result
      const pollResult = async () => {
        const statusResponse = await api.getSubmissionStatus(submissionId);
        const submission = statusResponse.data;

        if (submission.verdict !== 'PENDING') {
          setResult(submission);
          setSubmitting(false);

          if (submission.verdict === 'ACCEPTED') {
            toast.success('Accepted! 🎉');
          } else {
            toast.error(`${submission.verdict.replace(/_/g, ' ')}`);
          }
        } else {
          setTimeout(pollResult, 1000);
        }
      };

      pollResult();
    } catch (error) {
      setSubmitting(false);
      toast.error('Submission failed');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'text-green-500';
      case 'MEDIUM': return 'text-yellow-500';
      case 'HARD': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    if (verdict === 'ACCEPTED') {
      return <CheckCircle className="text-green-500" size={20} />;
    } else if (verdict === 'PENDING') {
      return <Loader className="text-blue-500 animate-spin" size={20} />;
    } else {
      return <XCircle className="text-red-500" size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Problem not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{problem.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className={`font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className="text-sm text-gray-500">
                Acceptance: {((problem.acceptedCount / problem.submissionCount) * 100 || 0).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 overflow-y-auto bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-800">
          <div className="p-6">
            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-dark-800">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-2 px-1 font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`pb-2 px-1 font-medium transition-colors ${
                  activeTab === 'submissions'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Submissions
              </button>
            </div>

            {activeTab === 'description' && (
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Problem</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{problem.description}</p>
                </div>

                {/* Sample Input/Output */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Example</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-dark-800 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Input:</p>
                      <pre className="text-sm text-gray-900 dark:text-gray-100 font-mono">{problem.sampleInput}</pre>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-800 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Output:</p>
                      <pre className="text-sm text-gray-900 dark:text-gray-100 font-mono">{problem.sampleOutput}</pre>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                {problem.explanation && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Explanation</h3>
                    <p className="text-gray-700 dark:text-gray-300">{problem.explanation}</p>
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Constraints</h3>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono text-sm">{problem.constraints}</p>
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>Time Limit: {problem.timeLimit}ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database size={16} />
                    <span>Memory Limit: {problem.memoryLimit}MB</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Your Submissions</h3>
                <p className="text-gray-500">Submission history will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 p-4">
            <CodeEditor onSubmit={handleSubmit} isSubmitting={submitting} />
          </div>

          {/* Result Panel */}
          {result && (
            <div className="bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-800 p-4">
              <div className="flex items-start gap-3">
                {getVerdictIcon(result.verdict)}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {result.verdict.replace(/_/g, ' ')}
                  </p>
                  {result.verdict === 'ACCEPTED' && (
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>Runtime: {result.executionTime}ms</span>
                      <span>Memory: {result.memoryUsed}KB</span>
                      <span>Score: {result.score}/100</span>
                    </div>
                  )}
                  {result.errorMessage && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{result.errorMessage}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
