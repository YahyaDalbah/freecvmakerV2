import { Link } from 'react-router-dom';
import Button from '../ui/buttons/Button';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-white mb-4">404</h1>
                    <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
                </div>
                
                <h2 className="text-4xl font-bold text-white mb-4">
                    Page Not Found
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/">
                        <Button variant="solid" color="blue">
                            Go to Home
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button variant="solid" color="white">
                            Sign In
                        </Button>
                    </Link>
                </div>
                
                <div className="mt-12">
                    <svg 
                        className="w-64 h-64 mx-auto opacity-20" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={0.5}
                            stroke="white"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}

