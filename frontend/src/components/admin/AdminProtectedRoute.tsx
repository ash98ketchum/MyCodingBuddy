import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuthStore } from '../../store/adminAuthStore';

interface AdminProtectedRouteProps {
    children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, admin } = useAdminAuthStore();

    if (!isAuthenticated || admin?.role !== 'ADMIN') {
        // Redirect unauthenticated or non-admin users to the specific admin login
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
};

export default AdminProtectedRoute;
