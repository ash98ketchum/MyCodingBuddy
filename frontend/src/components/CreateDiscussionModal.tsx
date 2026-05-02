// frontend/src/components/CreateDiscussionModal.tsx
import { useState, useEffect } from 'react';
import { Button, Input } from './ui';
import { X } from 'lucide-react';
import api from '@/services/api';
import { Problem } from '@/types';

interface CreateDiscussionModalProps {
    onClose: () => void;
    onSubmit: (data: { title: string; content: string; tags?: string; problemId?: string }) => void;
}

const CreateDiscussionModal = ({ onClose, onSubmit }: CreateDiscussionModalProps) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [problemId, setProblemId] = useState('');
    const [problems, setProblems] = useState<Problem[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

    useEffect(() => {
        loadProblems();
    }, []);

    const loadProblems = async () => {
        try {
            const response = await api.getProblems();
            setProblems(response.data.problems || []);
        } catch (error) {
            console.error('Failed to load problems:', error);
        }
    };

    const validate = () => {
        const newErrors: { title?: string; content?: string } = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        } else if (title.trim().length < 5) {
            newErrors.title = 'Title must be at least 5 characters';
        }

        if (!content.trim()) {
            newErrors.content = 'Content is required';
        } else if (content.trim().length < 20) {
            newErrors.content = 'Content must be at least 20 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setSubmitting(true);
        try {
            await onSubmit({
                title: title.trim(),
                content: content.trim(),
                tags: tags.trim() || undefined,
                problemId: problemId || undefined,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-800">
                    <h2 className="text-2xl font-bold">Create New Discussion</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-2">
                            Title <span className="text-error">*</span>
                        </label>
                        <Input
                            id="title"
                            type="text"
                            placeholder="What's your question or topic?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            error={errors.title}
                        />
                        {errors.title && <p className="text-error text-sm mt-1">{errors.title}</p>}
                    </div>

                    {/* Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium mb-2">
                            Description <span className="text-error">*</span>
                        </label>
                        <textarea
                            id="content"
                            rows={8}
                            placeholder="Provide details about your question or topic..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border-2 ${errors.content ? 'border-error' : 'border-gray-200'
                                } focus:border-accent focus:outline-none transition-colors resize-none`}
                        />
                        {errors.content && <p className="text-error text-sm mt-1">{errors.content}</p>}
                        <p className="text-xs text-text-tertiary mt-1">
                            {content.length}/20 characters minimum
                        </p>
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium mb-2">
                            Tags (optional)
                        </label>
                        <Input
                            id="tags"
                            type="text"
                            placeholder="e.g., algorithms, data-structures, dynamic-programming"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                        <p className="text-xs text-text-tertiary mt-1">
                            Separate tags with commas
                        </p>
                    </div>

                    {/* Problem Link */}
                    <div>
                        <label htmlFor="problemId" className="block text-sm font-medium mb-2">
                            Link to Problem (optional)
                        </label>
                        <select
                            id="problemId"
                            value={problemId}
                            onChange={(e) => setProblemId(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent focus:outline-none transition-colors bg-white"
                        >
                            <option value="">None</option>
                            {problems.map((problem) => (
                                <option key={problem.id} value={problem.id}>
                                    {problem.title} ({problem.difficulty})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={submitting}
                        >
                            {submitting ? 'Creating...' : 'Create Discussion'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateDiscussionModal;
