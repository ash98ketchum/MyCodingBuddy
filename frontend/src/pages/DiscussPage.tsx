// frontend/src/pages/DiscussPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Discussion } from '@/types';
import api from '@/services/api';
import { Search, MessageSquare, Plus, TrendingUp, Clock, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge, Skeleton, Input, Button } from '../components/ui';
import CreateDiscussionModal from '../components/CreateDiscussionModal';
import DiscussionCard from '../components/DiscussionCard';

const DiscussPage = () => {
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'unanswered'>('recent');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        loadDiscussions();
    }, [sortBy]);

    const loadDiscussions = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.getDiscussions({ sort: sortBy });
            setDiscussions(response.data.discussions || []);
        } catch (error: any) {
            console.error('Failed to load discussions:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load discussions. Please try again.';
            setError(errorMessage);
            setDiscussions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDiscussion = async (data: { title: string; content: string; tags?: string; problemId?: string }) => {
        try {
            await api.createDiscussion(data);
            setShowCreateModal(false);
            loadDiscussions(); // Refresh list
        } catch (error) {
            console.error('Failed to create discussion:', error);
        }
    };

    // Filter and sort discussions
    const filteredDiscussions = discussions.filter((discussion) => {
        const matchesSearch =
            discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            discussion.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTag === 'all' || discussion.tags?.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

    // Extract unique tags
    const allTags = discussions.reduce<string[]>((tags, discussion) => {
        if (discussion.tags) {
            const discussionTags = discussion.tags.split(',').map(t => t.trim()).filter(Boolean);
            discussionTags.forEach(tag => {
                if (!tags.includes(tag)) tags.push(tag);
            });
        }
        return tags;
    }, []);

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-background py-8">
                <div className="container-custom">
                    <div className="card p-12 text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">
                            Failed to Load Discussions
                        </h2>
                        <p className="text-text-secondary mb-6 max-w-md mx-auto">{error}</p>
                        <Button onClick={() => loadDiscussions()} icon={<MessageCircle size={18} />}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

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
                    <Skeleton variant="rectangular" className="h-12 w-40" />
                </div>

                <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} variant="rectangular" className="h-32 w-full" />
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
                    className="mb-8 flex items-center justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Discussions</h1>
                        <p className="text-text-secondary text-lg">
                            Connect with {discussions.length}+ discussions from the community
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        icon={<Plus size={18} />}
                        className="whitespace-nowrap"
                    >
                        New Discussion
                    </Button>
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
                                placeholder="Search discussions..."
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
                            <option value="recent">Recent</option>
                            <option value="popular">Popular</option>
                            <option value="unanswered">Unanswered</option>
                        </select>
                    </div>

                    {/* Tag Filters */}
                    {allTags.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            <button
                                onClick={() => setSelectedTag('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${selectedTag === 'all'
                                    ? 'bg-accent text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                All
                            </button>
                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${selectedTag === tag
                                        ? 'bg-accent text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="card p-4">
                        <div className="text-2xl font-bold text-accent">{discussions.length}</div>
                        <div className="text-sm text-text-secondary">Total Discussions</div>
                    </div>
                    <div className="card p-4">
                        <div className="text-2xl font-bold text-success">
                            {discussions.filter((d) => d._count && d._count.comments > 0).length}
                        </div>
                        <div className="text-sm text-text-secondary">Answered</div>
                    </div>
                    <div className="card p-4">
                        <div className="text-2xl font-bold text-warning">
                            {discussions.filter((d) => !d._count || d._count.comments === 0).length}
                        </div>
                        <div className="text-sm text-text-secondary">Unanswered</div>
                    </div>
                    <div className="card p-4">
                        <div className="text-2xl font-bold text-purple-600">
                            {allTags.length}
                        </div>
                        <div className="text-sm text-text-secondary">Topics</div>
                    </div>
                </motion.div>

                {/* Discussions List */}
                <div className="space-y-4">
                    {filteredDiscussions.length === 0 ? (
                        <div className="card p-12 text-center">
                            <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
                            <h3 className="text-xl font-semibold mb-2">No Discussions Found</h3>
                            <p className="text-text-secondary mb-4">
                                {searchQuery || selectedTag !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'Be the first to start a discussion!'}
                            </p>
                            {!searchQuery && selectedTag === 'all' && (
                                <Button onClick={() => setShowCreateModal(true)} icon={<Plus size={18} />}>
                                    Create Discussion
                                </Button>
                            )}
                        </div>
                    ) : (
                        filteredDiscussions.map((discussion, index) => (
                            <motion.div
                                key={discussion.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <DiscussionCard discussion={discussion} />
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Results count */}
                {filteredDiscussions.length > 0 && (
                    <div className="mt-6 text-center text-sm text-text-secondary">
                        Showing {filteredDiscussions.length} of {discussions.length} discussions
                    </div>
                )}
            </div>

            {/* Create Discussion Modal */}
            {showCreateModal && (
                <CreateDiscussionModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateDiscussion}
                />
            )}
        </div>
    );
};

export default DiscussPage;
