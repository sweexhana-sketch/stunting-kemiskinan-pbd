import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('admin' | 'dataentry')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login page but save the location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access if allowedRoles is specified
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // User doesn't have permission, redirect to home
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
