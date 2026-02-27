// frontend/src/pages/ProblemPage.tsx
//
// LeetCode-grade problem workspace.
// Left panel (tabbed): Description | Submissions | Results
// Right panel:  CodeEditor (Monaco) + sliding bottom ResultPanel
// Centre: draggable resize handle

import React, { useCallback, useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io as socketIO } from 'socket.io-client';
import toast from 'react-hot-toast';
import { Loader2, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import api from '@/services/api';
import { useAuthStore, useProblemStore, useEditorStore } from '@/store';
import { Problem, Submission, Language } from '@/types';
import CodeEditor from '@/components/CodeEditor';
import JudgingOverlay from '@/components/problem/JudgingOverlay';
import ResultPanel from '@/components/problem/ResultPanel';

// Lazy-load the heavy left-panel content
const ProblemDescription = lazy(() => import('@/components/problem/ProblemDescription'));
const ProblemSubmissions = lazy(() => import('@/components/problem/ProblemSubmissions'));
const VerdictResultPanel = lazy(() => import('@/components/problem/VerdictResultPanel'));

// ── Socket singleton ──────────────────────────────────────────────────────────
let _socket: ReturnType<typeof socketIO> | null = null;
const getSocket = () => {
  if (!_socket) {
    _socket = socketIO(
      (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', ''),
      { withCredentials: true, transports: ['websocket', 'polling'] }
    );
  }
  return _socket;
};

// ── Constants ─────────────────────────────────────────────────────────────────
const POLL_INTERVAL_MS = 1_500;
const MAX_POLL_DURATION_MS = 60_000;

const TAB_CFG = [
  { id: 'description', label: 'Description' },
  { id: 'submissions', label: 'Submissions' },
  { id: 'results', label: 'Results' },
] as const;

type LeftTab = typeof TAB_CFG[number]['id'];

const LazyLoader = () => (
  <div className="flex justify-center py-12">
    <Loader2 className="w-5 h-5 animate-spin text-[#FFB22C]" />
  </div>
);

// ── Page component ────────────────────────────────────────────────────────────
export const ProblemPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Auth guard
  const { isAuthenticated } = useAuthStore();
  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true });
  }, [isAuthenticated, navigate]);

  // Problem data
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);

  // Bottom panel state (right side)
  const [bottomResultTab, setBottomResultTab] = useState<'testcase' | 'result'>('testcase');
  const [bottomOpen, setBottomOpen] = useState(false);

  // Persisted workspace state
  const {
    activeLeftTab, setActiveLeftTab,
    latestResult, setLatestResult,
    leftPanelWidth, setLeftPanelWidth,
    getCodeForKey, setCodeForKey,
  } = useProblemStore();

  const { code, language, setCode, setLanguage } = useEditorStore();

  const pollCancelRef = useRef<() => void>(() => { });

  // ── Load problem ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.getProblem(slug!);
        const p: Problem = res?.data ?? res;
        if (!cancelled) {
          setProblem(p);
          setLatestResult(null); // clear stale result from another problem
          // Restore persisted code for this slug+lang
          const savedCode = getCodeForKey(`${slug}:${language}`);
          if (savedCode) setCode(savedCode);
        }
      } catch {
        if (!cancelled) toast.error('Failed to load problem');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; pollCancelRef.current?.(); };
  }, [slug]); // eslint-disable-line

  // Persist code to store on change
  useEffect(() => {
    if (slug && code) setCodeForKey(`${slug}:${language}`, code);
  }, [code, language, slug]); // eslint-disable-line

  // ── Polling / WebSocket ────────────────────────────────────────────────────
  const startPolling = useCallback((
    submissionId: string,
    onDone: (sub: Submission) => void,
    onError: () => void,
  ) => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    const startedAt = Date.now();

    pollCancelRef.current?.();
    pollCancelRef.current = () => { cancelled = true; clearTimeout(timeoutId); };

    const socket = getSocket();
    socket.emit('join_submission', submissionId);

    const onWsComplete = (data: any) => {
      if (cancelled) return;
      cancelled = true;
      clearTimeout(timeoutId);
      socket.off('submission:completed', onWsComplete);
      socket.off('submission_complete', onWsComplete);
      api.getSubmissionStatus(submissionId)
        .then((r: any) => onDone(r?.data ?? r))
        .catch(() => onDone(data));
    };

    socket.once('submission:completed', onWsComplete);
    socket.once('submission_complete', onWsComplete);

    const poll = async () => {
      if (cancelled) return;
      if (Date.now() - startedAt > MAX_POLL_DURATION_MS) {
        cancelled = true;
        socket.off('submission:completed', onWsComplete);
        socket.off('submission_complete', onWsComplete);
        toast.error('Submission timed out. Please try again.');
        onError();
        return;
      }
      try {
        const r: any = await api.getSubmissionStatus(submissionId);
        const sub: Submission = r?.data ?? r;
        if (cancelled) return;
        const done = sub.verdict !== 'PENDING' && sub.verdict !== 'QUEUED';
        if (done) {
          cancelled = true;
          socket.off('submission:completed', onWsComplete);
          socket.off('submission_complete', onWsComplete);
          onDone(sub);
        } else {
          timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch {
        if (!cancelled) timeoutId = setTimeout(poll, POLL_INTERVAL_MS * 2);
      }
    };

    poll();
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (editorCode: string, editorLang: string) => {
    if (!problem) return;
    try {
      setSubmitting(true);
      setLatestResult(null);
      setBottomOpen(true);
      setBottomResultTab('result');
      const resp: any = await api.submitCode({ problemId: problem.id, code: editorCode, language: editorLang });
      const submissionId = resp?.data?.submissionId ?? resp?.submissionId;
      toast.success('Submitted! Judging…');

      startPolling(
        submissionId,
        (sub) => {
          setLatestResult(sub);
          setSubmitting(false);
          // Show Results tab on left panel
          setActiveLeftTab('results');
          if (sub.verdict === 'ACCEPTED') {
            toast.success('🎉 Accepted!');
          } else {
            toast.error(sub.verdict.replace(/_/g, ' '));
          }
        },
        () => { setSubmitting(false); toast.error('Failed to get result'); }
      );
    } catch {
      setSubmitting(false);
      toast.error('Submission failed');
    }
  }, [problem, startPolling, setLatestResult, setActiveLeftTab]);

  const handleRun = useCallback(async (editorCode: string, editorLang: string) => {
    if (!problem) return;
    try {
      setRunning(true);
      setLatestResult(null);
      setBottomOpen(true);
      setBottomResultTab('result');
      const resp: any = await api.submitCode({ problemId: problem.id, code: editorCode, language: editorLang, sampleOnly: true });
      const submissionId = resp?.data?.submissionId ?? resp?.submissionId;
      toast.success('Running sample tests…');

      startPolling(
        submissionId,
        (sub) => {
          setLatestResult(sub);
          setRunning(false);
          if (sub.verdict === 'ACCEPTED') toast.success('All sample tests passed! 🎉');
          else toast.error(sub.verdict.replace(/_/g, ' '));
        },
        () => { setRunning(false); toast.error('Run failed'); }
      );
    } catch {
      setRunning(false);
      toast.error('Run failed');
    }
  }, [problem, startPolling, setLatestResult]);

  const handleLoadCode = useCallback((subCode: string, subLang: Language) => {
    setCode(subCode);
    setLanguage(subLang);
    toast.success('Code loaded from submission');
  }, [setCode, setLanguage]);

  // ── Drag-resize ─────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const onDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = (ev: MouseEvent) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setLeftPanelWidth(Math.min(Math.max(pct, 25), 65));
    };
    const onUp = () => {
      draggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [setLeftPanelWidth]);

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F1115]">
        <Loader2 className="w-10 h-10 animate-spin text-[#FFB22C]" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0F1115] gap-3">
        <p className="text-2xl font-bold text-white">Problem not found</p>
        <button onClick={() => navigate('/problems')} className="text-[#FFB22C] hover:underline text-sm flex items-center gap-1">
          <ArrowLeft size={14} />Back to problems
        </button>
      </div>
    );
  }

  const isJudging = submitting || running;

  const DIFFICULTY_COLOR: Record<string, string> = {
    EASY: 'text-emerald-400',
    MEDIUM: 'text-amber-400',
    HARD: 'text-rose-400',
  };

  return (
    <div className="h-screen flex flex-col bg-[#0F1115] overflow-hidden">

      {/* ── Top nav bar ── */}
      <div className="h-11 flex items-center justify-between px-4 bg-[#15181E] border-b border-[#2B303B] flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/problems')}
            className="p-1.5 hover:bg-[#2B303B] rounded-lg text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            <ArrowLeft size={15} />
          </button>
          <ChevronRight size={13} className="text-gray-700 flex-shrink-0" />
          <span className="text-sm font-medium text-white truncate max-w-[300px]">{problem.title}</span>
          <span className={`text-xs font-bold hidden sm:block flex-shrink-0 ${DIFFICULTY_COLOR[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
          <span className="hidden md:block">
            {((problem.acceptedCount / Math.max(problem.submissionCount, 1)) * 100).toFixed(1)}% accepted
          </span>
        </div>
      </div>

      {/* ── Main split-panel area ── */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden">

        {/* LEFT PANEL */}
        <div
          className="flex flex-col bg-[#15181E] overflow-hidden"
          style={{ width: `${leftPanelWidth}%`, flexShrink: 0 }}
        >
          {/* Tab bar */}
          <div className="flex items-center border-b border-[#2B303B] bg-[#0F1115] px-2 flex-shrink-0">
            {TAB_CFG.map(({ id, label }) => {
              // "Results" tab — hide if no result and never submitted
              if (id === 'results' && !latestResult) return null;
              const active = activeLeftTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveLeftTab(id as LeftTab)}
                  className={`relative px-4 py-2.5 text-sm font-medium transition-all ${active
                      ? 'text-[#FFB22C]'
                      : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                  {label}
                  {active && (
                    <motion.div
                      layoutId="left-tab-indicator"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-[#FFB22C] rounded-full"
                    />
                  )}
                  {/* Verdict badge on Results tab */}
                  {id === 'results' && latestResult && (
                    <span className={`ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${latestResult.verdict === 'ACCEPTED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                      }`}>
                      {latestResult.verdict === 'ACCEPTED' ? '✓' : '✗'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-5 pt-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2B303B]">
            <AnimatePresence mode="wait">
              {activeLeftTab === 'description' && (
                <motion.div key="desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                  <Suspense fallback={<LazyLoader />}>
                    <ProblemDescription problem={problem} />
                  </Suspense>
                </motion.div>
              )}

              {activeLeftTab === 'submissions' && (
                <motion.div key="subs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                  <Suspense fallback={<LazyLoader />}>
                    <ProblemSubmissions problemId={problem.id} onLoadCode={handleLoadCode} />
                  </Suspense>
                </motion.div>
              )}

              {activeLeftTab === 'results' && latestResult && (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                  <Suspense fallback={<LazyLoader />}>
                    <VerdictResultPanel result={latestResult} problem={problem} />
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Drag handle ── */}
        <div
          onMouseDown={onDragStart}
          className="w-1 cursor-col-resize bg-[#2B303B] hover:bg-[#FFB22C]/50 active:bg-[#FFB22C] transition-colors flex-shrink-0"
          title="Drag to resize"
        />

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Editor area (grows, shrinks based on bottom panel) */}
          <div className={`relative flex-1 overflow-hidden transition-all ${bottomOpen ? 'min-h-[200px]' : ''}`}>
            <CodeEditor
              onSubmit={handleSubmit}
              onRun={handleRun}
              isSubmitting={submitting}
              isRunning={running}
            />
            <JudgingOverlay visible={isJudging} mode={submitting ? 'submitting' : 'running'} />
          </div>

          {/* Bottom result panel — slides up when open */}
          <AnimatePresence>
            {bottomOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 260 }}
                exit={{ height: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <ResultPanel
                  result={latestResult}
                  isRunning={running}
                  isSubmitting={submitting}
                  sampleInput={problem.sampleInput}
                  onRun={(customInput) => handleRun(code, language)}
                  active={bottomResultTab}
                  onTabChange={setBottomResultTab}
                  totalTestCases={problem.testCases?.length ?? 0}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle strip for bottom panel */}
          <button
            onClick={() => setBottomOpen(o => !o)}
            className="flex-shrink-0 h-6 flex items-center justify-center bg-[#15181E] border-t border-[#2B303B] hover:bg-[#1E2229] transition-colors group"
          >
            <motion.div
              animate={{ rotate: bottomOpen ? 0 : 180 }}
              transition={{ duration: 0.2 }}
              className="text-gray-600 group-hover:text-gray-400"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 4L1 9h10L6 4z" />
              </svg>
            </motion.div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
