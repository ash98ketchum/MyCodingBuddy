// frontend/src/components/DiscussionCard.tsx
import { Link } from 'react-router-dom';
import { Discussion } from '@/types';
import { Badge } from './ui';
import { MessageCircle, TrendingUp, Eye, Pin, Lock } from 'lucide-react';

interface DiscussionCardProps {
    discussion: Discussion;
}

const DiscussionCard = ({ discussion }: DiscussionCardProps) => {
    const commentCount = discussion._count?.comments || 0;
    const hasAcceptedAnswer = discussion.comments?.some((c) => c.isAccepted) || false;

    // Format timestamp
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    return (
        <Link to={`/discuss/${discussion.id}`}>
            <div className="card-hover p-5 group">
                <div className="flex gap-4">
                    {/* Vote count sidebar */}
                    <div className="flex flex-col items-center gap-1 min-w-[60px]">
                        <div className="flex items-center gap-1">
                            <TrendingUp size={16} className="text-text-secondary" />
                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {discussion.upvotes - discussion.downvotes}
                            </span>
                        </div>
                        <span className="text-xs text-text-tertiary">votes</span>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                        {/* Title and badges */}
                        <div className="flex items-start gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-accent transition-colors flex-1">
                                {discussion.isPinned && <Pin size={16} className="inline mr-1 text-accent" />}
                                {discussion.isClosed && <Lock size={16} className="inline mr-1 text-gray-400" />}
                                {discussion.title}
                            </h3>
                            {hasAcceptedAnswer && (
                                <Badge variant="custom" className="shrink-0 bg-green-100 text-green-700 border border-green-200">
                                    ✓ Solved
                                </Badge>
                            )}
                        </div>

                        {/* Description preview */}
                        <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                            {discussion.content}
                        </p>

                        {/* Meta information */}
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            {/* Author */}
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white text-xs font-medium">
                                    {discussion.user.username?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-text-secondary">{discussion.user.username}</span>
                                {discussion.user.rating && (
                                    <span className="text-xs text-accent font-medium">
                                        {discussion.user.rating}
                                    </span>
                                )}
                            </div>

                            {/* Separator */}
                            <span className="text-gray-300">•</span>

                            {/* Time */}
                            <span className="text-text-tertiary">{formatTime(discussion.createdAt)}</span>

                            {/* Tags */}
                            {discussion.tags && (
                                <>
                                    <span className="text-gray-300">•</span>
                                    <div className="flex gap-2 flex-wrap">
                                        {discussion.tags.split(',').filter(Boolean).map((tag) => (
                                            <Badge key={tag.trim()} variant="tag">
                                                {tag.trim()}
                                            </Badge>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Problem link */}
                            {discussion.problem && (
                                <>
                                    <span className="text-gray-300">•</span>
                                    <Badge variant={discussion.problem.difficulty.toLowerCase() as any}>
                                        {discussion.problem.title}
                                    </Badge>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex flex-col items-center justify-center gap-3 min-w-[80px] text-center">
                        <div className="flex items-center gap-1">
                            <MessageCircle size={16} className="text-text-secondary" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {commentCount}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye size={16} className="text-text-secondary" />
                            <span className="text-sm text-text-secondary">{discussion.viewCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default DiscussionCard;
