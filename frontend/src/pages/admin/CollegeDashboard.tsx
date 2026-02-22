import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, School, Calendar, Users } from 'lucide-react';
import { api } from '@/services/api'; // Assuming generic api service exists

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
            const res = await api.get('/admin/programs');
            setPrograms(res.data);
        } catch (error) {
            console.error('Failed to fetch programs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
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

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        College Training Programs
                    </h1>
                    <p className="text-gray-400 mt-2">Manage automated training batches</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Program
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.map((program) => (
                        <Card
                            key={program.id}
                            className="p-6 bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all cursor-pointer group"
                            onClick={() => navigate(`/admin/programs/${program.id}`)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                                    <School className="w-6 h-6 text-blue-400" />
                                </div>
                                <span className={`px-2 py-1 rounded text-xs ${program.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {program.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <h3 className="text-xl font-semibold text-white mb-2">{program.name}</h3>

                            <div className="space-y-2 text-sm text-gray-400">
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {new Date(program.startDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-2" />
                                    {program._count?.students || 0} Students
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Simple Modal Implementation */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New Program</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Program Name</label>
                                <input
                                    type="text"
                                    value={newProgramName}
                                    onChange={(e) => setNewProgramName(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    Create
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollegeDashboard;
