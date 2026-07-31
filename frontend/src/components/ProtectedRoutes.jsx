import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ProtectedRoute() {
    const token = Cookies.get('token');
    const isValid = token && token !== 'undefined' && token !== 'null' && token.trim() !== '';

    if (!isValid) {
        Cookies.remove('token');
        return <Navigate to="/register" replace />;
    }

    return <Outlet />;
}