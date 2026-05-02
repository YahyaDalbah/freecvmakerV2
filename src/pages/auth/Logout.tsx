import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../ui/svgs/LoadingSpinner';

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 flex flex-col items-center">
                <LoadingSpinner className="h-8 w-8 mb-4" color="blue" />
                <p className="text-gray-700 font-semibold">Logging out...</p>
            </div>
        </div>
    );
}
