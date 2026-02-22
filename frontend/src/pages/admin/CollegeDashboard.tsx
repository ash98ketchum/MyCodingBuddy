import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, School, Calendar, Users, Briefcase } from 'lucide-react';
import { api } from '@/services/api';

interface Program {
    id: string;
    name: string;
    startDate: string;
    isActive: boolean;
    _count: {
        students: number;
        assignments: number;
    }
}

const CollegeDashboard = () => {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newProgramName, setNewProgramName] = useState('');
    const [startDate, setStartDate] = useState('');

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const res: any = await api.get('/admin/program/list');
            // Depending on backend response shape, the data is either in `res.data` or just `res` due to axios interceptors
            setPrograms(res.data || res);
        } catch (error) {
            console.error('Failed to fetch programs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Note: with the removal of the Legacy Program model, program creation
            // might need to be simulated or integrated differently going forward.
            await api.post('/admin/programs', {
                name: newProgramName,
                startDate: new Date(startDate).toISOString(),
            });
            setShowCreateModal(false);
            fetchPrograms();
            setNewProgramName('');
            setStartDate('');
        } catch (error) {
            alert('Failed to create program');
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
    };

    return (
        <div className="min-h-screen bg-background p-4 sm:p-8 lg:p-12">
            <Helmet>
                <title>College Training Programs | Admin Control Panel</title>
            </Helmet>

            <motion.div
                className="max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20 shadow-[0_0_15px_rgba(255,178,44,0.15)]">
                                <School className="w-6 h-6 text-accent" />
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
                                College Training Programs
                            </h1>
                        </div>
                        <p className="text-text-secondary max-w-2xl text-lg">
                            Manage automated training batches and monitor aggregated student engagement.
                        </p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)} className="bg-accent text-white hover:bg-accent-600 transition-colors shadow-sm">
                        <Plus className="w-4 h-4 mr-2" />
                        New Program
                    </Button>
                </motion.div>

                {loading ? (
                    <motion.div key="loading" variants={itemVariants} className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-accent animate-spin mb-4" />
                        <p className="text-text-tertiary">Fetching active programs...</p>
                    </motion.div>
                ) : (
                    <motion.div key="content" variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.map((program) => (
                            <motion.div variants={itemVariants} key={program.id}>
                                <Card
                                    className="p-6 bg-white border border-gray-200 hover:border-accent/40 hover:shadow-lg transition-all cursor-pointer group rounded-2xl h-full flex flex-col justify-between"
                                    onClick={() => navigate(`/admin/programs/${program.id}`)}
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors border border-accent/10">
                                                <Briefcase className="w-6 h-6 text-accent" />
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${program.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                                {program.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{program.name}</h3>

                                        <div className="space-y-3 text-sm text-gray-500 mb-4">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                Started {new Date(program.startDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 mr-2 text-gray-400" />
                                                <span className="font-medium text-gray-700">{program._count?.students || 0}</span>&nbsp;Students Enrolled
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="text-xs font-medium text-accent">
                                            {program._count?.assignments || 0} Total Assignments Dispatched
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Create Modal Implementation */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-8 rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Data Group</h2>
                            <form onSubmit={handleCreate} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Group Name / ID</label>
                                    <input
                                        type="text"
                                        value={newProgramName}
                                        onChange={(e) => setNewProgramName(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent rounded-xl p-3 text-gray-900 transition-colors outline-none"
                                        placeholder="e.g. COLLEGE_2026"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Simulation Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent rounded-xl p-3 text-gray-900 transition-colors outline-none"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                                    <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)} className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-accent hover:bg-accent-600 text-white shadow-sm">
                                        Create Group
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CollegeDashboard;
