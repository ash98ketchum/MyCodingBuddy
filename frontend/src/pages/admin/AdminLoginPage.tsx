import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminAuthLayout from '../../components/admin/AdminAuthLayout';
import AdminLoginForm from '../../components/admin/AdminLoginForm';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { Helmet } from 'react-helmet-async';

const AdminLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, admin } = useAdminAuthStore();

    useEffect(() => {
        // Auto-redirect if already logged in as admin
        if (isAuthenticated && admin?.role === 'ADMIN') {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [isAuthenticated, admin, navigate]);

    return (
        <>
            <Helmet>
                <title>Control System | Admin Login</title>
                <meta name="theme-color" content="#0B0F19" />
            </Helmet>
            <AdminAuthLayout>
                <AdminLoginForm />
            </AdminAuthLayout>
        </>
    );
};

export default AdminLoginPage;
