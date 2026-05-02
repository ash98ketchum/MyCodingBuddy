// frontend/src/components/CommentThread.tsx
import { useState } from 'react';
import { Comment } from '@/types';
import { useAuthStore } from '@/store';
import api from '@/services/api';
import { ThumbsUp, ThumbsDown, Reply, Edit, Trash2, Check } from 'lucide-react';
import { Button } from './ui';
import toast from 'react-hot-toast';

interface CommentThreadProps {
    comments: Comment[];
    discussionAuthorId: string;
    onReload: () => void;
    depth?: number;
}

const CommentThread = ({ comments, discussionAuthorId, onReload, depth = 0 }: CommentThreadProps) => {
    const { user } = useAuthStore();
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [editContent, setEditContent] = useState('');

    const handleReply = async (parentId: string) => {
        if (!replyContent.trim()) return;

        try {
            await api.createComment({
                discussionId: comments[0]?.discussionId || '',
                content: replyContent.trim(),
                parentId,
            });
            setReplyContent('');
            setReplyingTo(null);
            onReload();
            toast.success('Reply posted!');
        } catch (error) {
            console.error('Failed to post reply:', error);
        }
    };

    const handleEdit = async (commentId: string) => {
        if (!editContent.trim()) return;

        try {
            await api.updateComment(commentId, editContent.trim());
            setEditContent('');
            setEditingId(null);
            onReload();
            toast.success('Comment updated!');
        } catch (error) {
            console.error('Failed to update comment:', error);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            await api.deleteComment(commentId);
            onReload();
            toast.success('Comment deleted!');
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const handleMarkAsAccepted = async (commentId: string) => {
        try {
            await api.markAsAccepted(commentId);
            onReload();
            toast.success('Comment marked as accepted answer!');
        } catch (error) {
            console.error('Failed to mark comment as accepted:', error);
        }
    };

    const handleVote = async (commentId: string, type: 'UP' | 'DOWN') => {
        try {
            await api.vote({ type, commentId });
            onReload();
        } catch (error) {
            console.error('Failed to vote:', error);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className={depth > 0 ? 'ml-8 border-l-2 border-gray-200 dark:border-dark-700 pl-4' : 'space-y-4'}>
            {comments.map((comment) => {
                const isAuthor = user?.id === comment.userId;
                const isDiscussionAuthor = comment.userId === discussionAuthorId;
                const canDelete = isAuthor || user?.role === 'ADMIN';
                const canMarkAsAccepted = user?.id === discussionAuthorId;
                const isEditing = editingId === comment.id;

                return (
                    <div key={comment.id} className={`${depth > 0 ? 'mb-4' : 'card p-5 mb-4'}`}>
                        {/* Comment header */}
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white font-medium shrink-0">
                                {comment.user.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold">{comment.user.username}</span>
                                    {comment.user.rating && (
                                        <span className="text-xs text-accent font-medium">{comment.user.rating}</span>
                                    )}
                                    {isDiscussionAuthor && (
                                        <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded font-medium">
                                            Author
                                        </span>
                                    )}
                                    {comment.isAccepted && (
                                        <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded font-medium flex items-center gap-1">
                                            <Check size={12} />
                                            Accepted Answer
                                        </span>
                                    )}
                                    <span className="text-sm text-text-tertiary">{formatTime(comment.createdAt)}</span>
                                    {comment.updatedAt !== comment.createdAt && (
                                        <span className="text-xs text-text-tertiary">(edited)</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Comment content */}
                        {isEditing ? (
                            <div className="mb-3">
                                <textarea
                                    rows={3}
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-accent focus:outline-none transition-colors resize-none mb-2"
                                />
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleEdit(comment.id)}>
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => {
                                            setEditingId(null);
                                            setEditContent('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-900 dark:text-gray-100 mb-3 whitespace-pre-wrap">
                                {comment.content}
                            </p>
                        )}

                        {/* Comment actions */}
                        <div className="flex items-center gap-4 text-sm">
                            {/* Vote buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleVote(comment.id, 'UP')}
                                    className="flex items-center gap-1 hover:text-accent transition-colors"
                                >
                                    <ThumbsUp size={16} />
                                    <span>{comment.upvotes}</span>
                                </button>
                                <button
                                    onClick={() => handleVote(comment.id, 'DOWN')}
                                    className="flex items-center gap-1 hover:text-error transition-colors"
                                >
                                    <ThumbsDown size={16} />
                                    <span>{comment.downvotes}</span>
                                </button>
                            </div>

                            {/* Reply button */}
                            {depth < 3 && (
                                <button
                                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                    className="flex items-center gap-1 text-text-secondary hover:text-accent transition-colors"
                                >
                                    <Reply size={16} />
                                    Reply
                                </button>
                            )}

                            {/* Edit button */}
                            {isAuthor && !isEditing && (
                                <button
                                    onClick={() => {
                                        setEditingId(comment.id);
                                        setEditContent(comment.content);
                                    }}
                                    className="flex items-center gap-1 text-text-secondary hover:text-accent transition-colors"
                                >
                                    <Edit size={16} />
                                    Edit
                                </button>
                            )}

                            {/* Delete button */}
                            {canDelete && (
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="flex items-center gap-1 text-text-secondary hover:text-error transition-colors"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            )}

                            {/* Mark as accepted */}
                            {canMarkAsAccepted && !comment.isAccepted && (
                                <button
                                    onClick={() => handleMarkAsAccepted(comment.id)}
                                    className="flex items-center gap-1 text-text-secondary hover:text-success transition-colors"
                                >
                                    <Check size={16} />
                                    Mark as Answer
                                </button>
                            )}
                        </div>

                        {/* Reply form */}
                        {replyingTo === comment.id && (
                            <div className="mt-3 ml-13">
                                <textarea
                                    rows={3}
                                    placeholder="Write your reply..."
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-accent focus:outline-none transition-colors resize-none mb-2"
                                />
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleReply(comment.id)}>
                                        Reply
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => {
                                            setReplyingTo(null);
                                            setReplyContent('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Nested replies */}
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-4">
                                <CommentThread
                                    comments={comment.replies}
                                    discussionAuthorId={discussionAuthorId}
                                    onReload={onReload}
                                    depth={depth + 1}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default CommentThread;
