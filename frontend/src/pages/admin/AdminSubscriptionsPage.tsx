import React, { useState, useEffect } from 'react';
import { CreditCard, Edit2, Save, X, Building } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface CollegeSubscription {
    id: string;
    name: string;
    domain: string | null;
    subscriptionPlan: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
    subscriptionEnd: string | null;
    isActive: boolean;
    createdAt: string;
}

const AdminSubscriptionsPage: React.FC = () => {
    const [colleges, setColleges] = useState<CollegeSubscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<CollegeSubscription>>({});

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const res = await api.getAllSubscriptions();
            if (res.success) {
                setColleges(res.data);
            }
        } catch (error) {
            toast.error('Failed to load subscriptions');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (college: CollegeSubscription) => {
        setIsEditing(college.id);
        const formattedDate = college.subscriptionEnd
            ? new Date(college.subscriptionEnd).toISOString().split('T')[0]
            : '';
        setEditForm({
            subscriptionPlan: college.subscriptionPlan,
            subscriptionEnd: formattedDate as any,
            isActive: college.isActive
        });
    };

    const handleSave = async (id: string) => {
        try {
            const res = await api.updateSubscription(id, editForm);
            if (res.success) {
                toast.success('Subscription updated');
                setIsEditing(null);
                fetchSubscriptions();
            }
        } catch (error) {
            toast.error('Failed to update subscription');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-accent-600 bg-clip-text text-transparent">
                        Global Subscriptions
                    </h1>
                    <p className="text-gray-500 mt-2">Manage college revenue and premium status.</p>
                </div>
                <CreditCard className="text-accent" size={40} />
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-semibold text-gray-500">
                                <th className="p-4">College Name</th>
                                <th className="p-4">Plan</th>
                                <th className="p-4">Active</th>
                                <th className="p-4">Valid Until</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {colleges.map((col) => (
                                <tr key={col.id} className="hover:bg-gray-50/50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Building className="text-gray-400" size={16} />
                                            <span className="font-medium text-gray-900">{col.name}</span>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">{col.domain || 'No domain'}</div>
                                    </td>

                                    {isEditing === col.id ? (
                                        <>
                                            <td className="p-4">
                                                <select
                                                    className="input-field py-1 px-2 text-sm"
                                                    value={editForm.subscriptionPlan}
                                                    onChange={e => setEditForm({ ...editForm, subscriptionPlan: e.target.value as any })}
                                                >
                                                    <option value="FREE">FREE</option>
                                                    <option value="PREMIUM">PREMIUM</option>
                                                    <option value="ENTERPRISE">ENTERPRISE</option>
                                                </select>
                                            </td>
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={editForm.isActive}
                                                    onChange={e => setEditForm({ ...editForm, isActive: e.target.checked })}
                                                />
                                            </td>
                                            <td className="p-4">
                                                <input
                                                    type="date"
                                                    className="input-field py-1 px-2 text-sm"
                                                    value={editForm.subscriptionEnd as string || ''}
                                                    onChange={e => setEditForm(prev => ({ ...prev, subscriptionEnd: e.target.value as any }))}
                                                />
                                            </td>
                                            <td className="p-4 text-right flex justify-end gap-2">
                                                <button onClick={() => handleSave(col.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                                    <Save size={18} />
                                                </button>
                                                <button onClick={() => setIsEditing(null)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                    <X size={18} />
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${col.subscriptionPlan === 'PREMIUM' ? 'bg-purple-100 text-purple-700' :
                                                        col.subscriptionPlan === 'ENTERPRISE' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {col.subscriptionPlan}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`flex items-center gap-1 text-sm ${col.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                                    <div className={`w-2 h-2 rounded-full ${col.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                                    {col.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {col.subscriptionEnd ? new Date(col.subscriptionEnd).toLocaleDateString() : 'Lifetime / N/A'}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => handleEdit(col)} className="p-2 text-gray-400 hover:text-accent hover:bg-accent-50 rounded-lg transition-colors">
                                                    <Edit2 size={18} />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && colleges.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No colleges found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSubscriptionsPage;
