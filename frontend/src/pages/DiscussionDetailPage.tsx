// frontend/src/pages/DiscussionDetailPage.tsx
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Discussion, Comment } from '@/types';
import api from '@/services/api';
import { useAuthStore } from '@/store';
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageCircle, Pin, Lock, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge, Button, Skeleton } from '../components/ui';
import CommentThread from '../components/CommentThread';
import toast from 'react-hot-toast';

const DiscussionDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [discussion, setDiscussion] = useState<Discussion | null>(null);
    const [loading, setLoading] = useState(true);
    const [commentContent, setCommentContent] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [userVote, setUserVote] = useState<'UP' | 'DOWN' | null>(null);
    const viewIncrementedRef = useRef(false); // Track if view was already incremented

    useEffect(() => {
        if (id) {
            // Reset ref when ID changes
            viewIncrementedRef.current = false;
            loadDiscussion();
        }
    }, [id]);

    const loadDiscussion = async () => {
        try {
            setLoading(true);
            const response = await api.getDiscussionById(id!);
            setDiscussion(response.data.discussion);
            // Mark as incremented after first successful load
            viewIncrementedRef.current = true;
        } catch (error) {
            console.error('Failed to load discussion:', error);
            toast.error('Failed to load discussion');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (type: 'UP' | 'DOWN') => {
        if (!discussion) return;

        try {
            if (userVote === type) {
                // Remove vote
                await api.removeVote({ discussionId: discussion.id });
                setUserVote(null);
                setDiscussion({
                    ...discussion,
                    upvotes: type === 'UP' ? discussion.upvotes - 1 : discussion.upvotes,
                    downvotes: type === 'DOWN' ? discussion.downvotes - 1 : discussion.downvotes,
                });
            } else {
                // Add or change vote
                await api.vote({ type, discussionId: discussion.id });
                setDiscussion({
                    ...discussion,
                    upvotes: type === 'UP'
                        ? discussion.upvotes + (userVote === 'DOWN' ? 1 : 1)
                        : discussion.upvotes - (userVote === 'UP' ? 1 : 0),
                    downvotes: type === 'DOWN'
                        ? discussion.downvotes + (userVote === 'UP' ? 1 : 1)
                        : discussion.downvotes - (userVote === 'DOWN' ? 1 : 0),
                });
                setUserVote(type);
            }
        } catch (error) {
            console.error('Failed to vote:', error);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim() || !discussion) return;

        setSubmittingComment(true);
        try {
            await api.createComment({
                discussionId: discussion.id,
                content: commentContent.trim(),
            });
            setCommentContent('');
            await loadDiscussion(); // Reload to get new comment
            toast.success('Comment posted!');
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteDiscussion = async () => {
        if (!discussion) return;
        if (!confirm('Are you sure you want to delete this discussion?')) return;

        try {
            await api.deleteDiscussion(discussion.id);
            toast.success('Discussion deleted');
            navigate('/discuss');
        } catch (error) {
            console.error('Failed to delete discussion:', error);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background py-8">
                <div className="container-custom max-w-4xl">
                    <Skeleton variant="rectangular" className="h-12 w-32 mb-6" />
                    <Skeleton variant="rectangular" className="h-64 w-full mb-6" />
                    <Skeleton variant="rectangular" className="h-48 w-full" />
                </div>
            </div>
        );
    }

    if (!discussion) {
        return (
            <div className="min-h-screen bg-background py-8">
                <div className="container-custom max-w-4xl">
                    <div className="card p-12 text-center">
                        <h2 className="text-2xl font-bold mb-2">Discussion Not Found</h2>
                        <p className="text-text-secondary mb-4">This discussion may have been deleted or doesn't exist.</p>
                        <Button onClick={() => navigate('/discuss')} icon={<ArrowLeft size={18} />}>
                            Back to Discussions
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const isAuthor = user?.id === discussion.userId;
    const canDelete = isAuthor || user?.role === 'ADMIN';

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container-custom max-w-4xl">
                {/* Back button */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Link
                        to="/discuss"
                        className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Discussions
                    </Link>
                </motion.div>

                {/* Discussion */}
                <motion.div
                    className="card p-6 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                        {/* Vote buttons */}
                        <div className="flex flex-col items-center gap-2">
                            <button
                                onClick={() => handleVote('UP')}
                                className={`p-2 rounded-lg transition-colors ${userVote === 'UP'
                                    ? 'bg-accent text-white'
                                    : 'hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-600'
                                    }`}
                            >
                                <ThumbsUp size={20} />
                            </button>
                            <span className="text-xl font-bold">
                                {discussion.upvotes - discussion.downvotes}
                            </span>
                            <button
                                onClick={() => handleVote('DOWN')}
                                className={`p-2 rounded-lg transition-colors ${userVote === 'DOWN'
                                    ? 'bg-error text-white'
                                    : 'hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-600'
                                    }`}
                            >
                                <ThumbsDown size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <h1 className="text-3xl font-bold">
                                    {discussion.isPinned && <Pin size={20} className="inline mr-2 text-accent" />}
                                    {discussion.isClosed && <Lock size={20} className="inline mr-2 text-gray-400" />}
                                    {discussion.title}
                                </h1>
                                {canDelete && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleDeleteDiscussion}
                                            className="p-2 text-error hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete discussion"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white font-medium">
                                        {discussion.user.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium">{discussion.user.username}</span>
                                    {discussion.user.rating && (
                                        <span className="text-xs text-accent font-medium">
                                            {discussion.user.rating}
                                        </span>
                                    )}
                                </div>
                                <span>•</span>
                                <span>{formatTime(discussion.createdAt)}</span>
                                <span>•</span>
                                <span>{discussion.viewCount} views</span>
                            </div>

                            {/* Tags */}
                            {discussion.tags && (
                                <div className="flex gap-2 flex-wrap mb-4">
                                    {discussion.tags.split(',').filter(Boolean).map((tag) => (
                                        <Badge key={tag.trim()} variant="tag">
                                            {tag.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Problem link */}
                            {discussion.problem && (
                                <Link
                                    to={`/problems/${discussion.problem.slug}`}
                                    className="inline-block mb-4"
                                >
                                    <Badge variant={discussion.problem.difficulty.toLowerCase() as any}>
                                        Problem: {discussion.problem.title}
                                    </Badge>
                                </Link>
                            )}

                            {/* Content */}
                            <div className="prose prose-lg max-w-none">
                                <p className="whitespace-pre-wrap">{discussion.content}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Comment form */}
                {!discussion.isClosed && (
                    <motion.div
                        className="card p-6 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <MessageCircle size={20} />
                            Post a Comment
                        </h3>
                        <form onSubmit={handleSubmitComment}>
                            <textarea
                                rows={4}
                                placeholder="Share your thoughts..."
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent focus:outline-none transition-colors resize-none mb-3"
                            />
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={!commentContent.trim() || submittingComment}
                                >
                                    {submittingComment ? 'Posting...' : 'Post Comment'}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Comments */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-xl font-bold mb-4">
                        {discussion.comments?.length || 0} Comments
                    </h3>
                    {discussion.comments && discussion.comments.length > 0 ? (
                        <CommentThread
                            comments={discussion.comments.filter(c => !c.parentId)}
                            discussionAuthorId={discussion.userId}
                            onReload={loadDiscussion}
                        />
                    ) : (
                        <div className="card p-8 text-center">
                            <MessageCircle className="mx-auto mb-3 text-gray-400" size={48} />
                            <p className="text-text-secondary">No comments yet. Be the first to comment!</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default DiscussionDetailPage;
