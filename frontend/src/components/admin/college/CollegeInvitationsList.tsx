import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Plus, X, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import api from '../../../services/api';

interface Invitation {
    id: string;
    email: string;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
    expiresAt: string;
    createdAt: string;
}

export const CollegeInvitationsList: React.FC<{ collegeId: string }> = ({ collegeId }) => {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [emailsInput, setEmailsInput] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    const [inviteResult, setInviteResult] = useState<{ invited: number; alreadyEnrolled: number; errors: string[] } | null>(null);

    const fetchInvitations = async () => {
        try {
            const res = await api.get(`/admin/college/${collegeId}/invitations`);
            setInvitations(res.data?.data || []);
        } catch (error) {
            console.error('Failed to fetch invitations', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvitations();
    }, [collegeId]);

    const handleInviteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Split by comma, space, or newline
        const rawEmails = emailsInput.split(/[\s,]+/).filter(e => e.trim() !== '');

        if (rawEmails.length === 0) return;

        setIsInviting(true);
        setInviteResult(null);

        try {
            const res = await api.post(`/admin/college/${collegeId}/invite-students`, {
                emails: rawEmails
            });

            setInviteResult(res.data?.data);
            setEmailsInput('');
            fetchInvitations();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to send invitations');
        } finally {
            setIsInviting(false);
        }
    };

    const StatusBadge = ({ status }: { status: Invitation['status'] }) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            ACCEPTED: 'bg-green-100 text-green-800 border-green-200',
            DECLINED: 'bg-red-100 text-red-800 border-red-200',
            EXPIRED: 'bg-gray-100 text-gray-800 border-gray-200'
        };

        const icons = {
            PENDING: <Clock className="w-3 h-3 mr-1" />,
            ACCEPTED: <CheckCircle2 className="w-3 h-3 mr-1" />,
            DECLINED: <X className="w-3 h-3 mr-1" />,
            EXPIRED: <AlertCircle className="w-3 h-3 mr-1" />
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
                {icons[status]}
                {status}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mt-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-accent" />
                        Student Invitations
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage email enrollments and opt-outs.</p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm shadow-gray-900/10"
                >
                    <Plus className="w-4 h-4" />
                    Invite Students
                </button>
            </div>

            {/* Invitations Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50/50 text-gray-700 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">Email</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Invited On</th>
                            <th className="px-4 py-3 rounded-r-lg">Expires</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-accent mx-auto" />
                                </td>
                            </tr>
                        ) : invitations.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                    No invitations sent yet.
                                </td>
                            </tr>
                        ) : (
                            invitations.map((invite) => (
                                <tr key={invite.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {invite.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={invite.status} />
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {new Date(invite.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {new Date(invite.expiresAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Bulk Invite Students</h3>
                            <button onClick={() => { setShowInviteModal(false); setInviteResult(null); }} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {inviteResult ? (
                            <div className="space-y-4 mb-6">
                                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                    <h4 className="font-semibold text-green-800">Invitation Summary</h4>
                                    <ul className="text-sm text-green-700 mt-2 space-y-1">
                                        <li>Successfully Invited: <strong>{inviteResult.invited}</strong></li>
                                        <li>Already Enrolled: <strong>{inviteResult.alreadyEnrolled}</strong></li>
                                    </ul>
                                </div>
                                {inviteResult.errors.length > 0 && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <h4 className="font-semibold text-red-800">Errors encountered</h4>
                                        <ul className="text-sm text-red-700 mt-2 list-disc pl-5 max-h-32 overflow-y-auto">
                                            {inviteResult.errors.map((err, i) => <li key={i}>{err}</li>)}
                                        </ul>
                                    </div>
                                )}
                                <button
                                    onClick={() => { setShowInviteModal(false); setInviteResult(null); }}
                                    className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleInviteSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Addresses
                                    </label>
                                    <textarea
                                        value={emailsInput}
                                        onChange={(e) => setEmailsInput(e.target.value)}
                                        placeholder="student1@college.edu, student2@college.edu&#10;Paste bulk emails here (comma or space separated)..."
                                        className="w-full h-40 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all text-sm resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isInviting || !emailsInput.trim()}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium"
                                >
                                    {isInviting ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                                    ) : (
                                        <><Mail className="w-4 h-4" /> Send Invitations</>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
};
