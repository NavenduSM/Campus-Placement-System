import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken, getJwtPayload } from '../utils/auth.js';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const token = getAuthToken();
    const location = useLocation();

    // Check if user is authenticated
    if (!token) {
        // Redirect to login page with return url
        return <Navigate to="/signup" state={{ from: location }} replace />;
    }

    // Check if token is valid (basic check)
    const payload = getJwtPayload();
    if (!payload) {
        // Invalid token, redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('authRole');
        return <Navigate to="/signup" state={{ from: location }} replace />;
    }

    // Check if user has required role (if roles are specified)
    if (allowedRoles.length > 0) {
        const userRole = localStorage.getItem('authRole');
        if (!allowedRoles.includes(userRole)) {
            // User doesn't have required role, redirect to appropriate dashboard or login
            if (userRole === 'student') {
                return <Navigate to="/student/company-list" replace />;
            } else if (userRole === 'tpo') {
                return <Navigate to="/tpo/view-jobs" replace />;
            } else {
                return <Navigate to="/signup" replace />;
            }
        }
    }

    return children;
};

export default ProtectedRoute;