import { Link } from 'react-router-dom';

export default function ContinueAsGuest() {
    return (
        <div className="mt-3 text-center text-sm">
            <span className="text-gray-600">Or you can </span>
            <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold">
                continue as guest
            </Link>
        </div>
    );
}
