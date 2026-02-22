import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Assuming tabs component exists or use raw
import { Upload, Play, FileText, CheckCircle } from 'lucide-react';
import { api } from '@/services/api';

const ProgramDetails = () => {
    const { id } = useParams();
    const [program, setProgram] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Import State
    const [csvContent, setCsvContent] = useState('');
    const [importStatus, setImportStatus] = useState<any>(null);

    // Pool State
    const [problemIds, setProblemIds] = useState('');
    const [difficulty, setDifficulty] = useState('BEGINNER');

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const res = await api.get(`/admin/programs/${id}`);
            setProgram(res.data);
        } catch (error) {
            console.error('Failed to fetch program details');
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async () => {
        try {
            const res = await api.post(`/admin/programs/${id}/students`, { csvContent });
            setImportStatus(res.data);
        } catch (error: any) {
            alert('Import failed: ' + error.message);
        }
    };

    const handleAddPool = async () => {
        try {
            const ids = problemIds.split(',').map(s => s.trim()).filter(Boolean);
            await api.post(`/admin/programs/${id}/pool`, {
                problemIds: ids,
                difficultyTag: difficulty
            });
            alert('Problems added to pool');
            setProblemIds('');
            fetchDetails();
        } catch (error: any) {
            alert('Failed to add problems: ' + error.message);
        }
    };

    const triggerAssignment = async () => {
        if (!confirm('Run daily assignment now?')) return;
        try {
            const res = await api.post(`/admin/programs/${id}/assignment`);
            alert(`Assignment Run: Assigned ${res.data.assigned} / ${res.data.totalStudents}`);
        } catch (error: any) {
            alert('Error: ' + error.message);
        }
    };

    const triggerReport = async () => {
        if (!confirm('Generate and email reports now?')) return;
        try {
            await api.post(`/admin/programs/${id}/report`);
            alert('Reports generated and emailed.');
        } catch (error: any) {
            alert('Error: ' + error.message);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!program) return <div className="p-10 text-center">Program not found</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center bg-gray-900 p-6 rounded-lg border border-gray-800">
                <div>
                    <h1 className="text-2xl font-bold text-white">{program.name}</h1>
                    <p className="text-gray-400">
                        Students: {program.students.length} | Pool: {program.problemPool.length}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={triggerAssignment} variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-900">
                        <Play className="w-4 h-4 mr-2" />
                        Run Day
                    </Button>
                    <Button onClick={triggerReport} variant="outline" className="border-green-500 text-green-400 hover:bg-green-900">
                        <FileText className="w-4 h-4 mr-2" />
                        Gen Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Import */}
                <Card className="p-6 bg-gray-900 border-gray-800">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <Upload className="w-4 h-4 mr-2 text-purple-400" /> Import Students
                    </h2>
                    <div className="space-y-4">
                        <p className="text-xs text-gray-400">Paste CSV content (email,section)</p>
                        <textarea
                            value={csvContent}
                            onChange={(e) => setCsvContent(e.target.value)}
                            className="w-full h-32 bg-gray-800 border border-gray-700 rounded p-2 text-sm font-mono text-white"
                            placeholder="student1@email.com, BEGINNER&#10;student2@email.com, INTERMEDIATE"
                        />
                        <Button onClick={handleImport} className="w-full bg-purple-600 hover:bg-purple-700">
                            Import Students
                        </Button>
                        {importStatus && (
                            <div className="mt-4 p-3 bg-gray-800 rounded text-sm">
                                <p className="text-green-400">Success: {importStatus.success}</p>
                                <p className="text-red-400">Failed: {importStatus.failed}</p>
                                {importStatus.errors?.length > 0 && (
                                    <ul className="mt-2 text-red-300 text-xs list-disc pl-4">
                                        {importStatus.errors.map((e: string, i: number) => <li key={i}>{e}</li>)}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Problem Pool */}
                <Card className="p-6 bg-gray-900 border-gray-800">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-yellow-400" /> Add to Pool
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400">Difficulty Tag</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full bg-gray-800 mt-1 border border-gray-700 rounded p-2 text-white"
                            >
                                <option value="BEGINNER">BEGINNER</option>
                                <option value="INTERMEDIATE">INTERMEDIATE</option>
                                <option value="EXPERT">EXPERT</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Problem IDs (comma separated)</label>
                            <input
                                type="text"
                                value={problemIds}
                                onChange={(e) => setProblemIds(e.target.value)}
                                className="w-full bg-gray-800 mt-1 border border-gray-700 rounded p-2 text-white"
                                placeholder="cm1..., cm2..."
                            />
                        </div>
                        <Button onClick={handleAddPool} className="w-full bg-yellow-600 hover:bg-yellow-700">
                            Add Problems
                        </Button>
                    </div>
                    <div className="mt-6 border-t border-gray-800 pt-4">
                        <h3 className="text-sm font-semibold mb-2">Pool Stats</h3>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-400">
                            <div className="bg-gray-800 p-2 rounded">
                                Beg: {program.problemPool.filter((p: any) => p.difficultyTag === 'BEGINNER').length}
                            </div>
                            <div className="bg-gray-800 p-2 rounded">
                                Int: {program.problemPool.filter((p: any) => p.difficultyTag === 'INTERMEDIATE').length}
                            </div>
                            <div className="bg-gray-800 p-2 rounded">
                                Exp: {program.problemPool.filter((p: any) => p.difficultyTag === 'EXPERT').length}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

        </div>
    );
};

export default ProgramDetails;
