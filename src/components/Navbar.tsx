import { Link, useNavigate, useMatches } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Button from "../ui/buttons/Button";
import Tabs from "../ui/tabs/Tabs";
import {
    matchShowsGeneratePdfButton,
    matchShowCvEditorTabs,
    type CvEditorTab,
} from "../layoutContext";

export default function Navbar({
    cvGeneratePdfHandler,
    cvEditorTab,
    setCvEditorTab,
}: {
    cvGeneratePdfHandler: (() => Promise<void>) | null;
    cvEditorTab: CvEditorTab;
    setCvEditorTab: (tab: CvEditorTab) => void;
}) {
    const navigate = useNavigate();
    const matches = useMatches();
    const showGeneratePdfButton = matchShowsGeneratePdfButton(matches);
    const showCvEditorTabs = matchShowCvEditorTabs(matches);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    async function handleGeneratePdfClick() {
        if (!cvGeneratePdfHandler || pdfLoading) return;
        setPdfLoading(true);
        try {
            await cvGeneratePdfHandler();
        } finally {
            setPdfLoading(false);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        if (token) {
            // Try to get user email from localStorage
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setUserEmail(user.email || '');
                } catch (e) {
                    console.error('Failed to parse user data');
                }
            }
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    function handleLogout() {
        navigate('/logout');
    }

    return (
        <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex justify-between flex-wrap gap-x-4 gap-y-3">
                <Link to="/" className="text-xl font-bold text-gray-800 transition hover:text-blue-600">
                    FreeCVMaker
                </Link>

                {showCvEditorTabs && (
                    <Tabs
                        value={cvEditorTab}
                        onChange={setCvEditorTab}
                        tabs={[
                            { value: "editing", label: "Editing" },
                            { value: "templates", label: "Templates" },
                        ]}
                    />
                )}

                <div className="flex shrink-0 gap-x-4 gap-y-2">
                    {isLoggedIn ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                <div className="w-6 h-6 bg-blue-600 text-sm rounded-full flex items-center justify-center text-white font-semibold">
                                    {userEmail ? userEmail[0].toUpperCase() : 'U'}
                                </div>
                                <span className="hidden sm:block text-sm font-medium text-gray-700">
                                    {userEmail || 'User'}
                                </span>
                                <svg 
                                    className={`w-4 h-4 text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <p className="text-sm font-medium text-gray-900 truncate">{userEmail}</p>
                                        <p className="text-xs text-gray-500">Signed in</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="text-sm font-medium px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                    {showGeneratePdfButton && (
                        <div className="flex shrink-0 items-center">
                            <Button
                                variant="solid"
                                color="emerald"
                                shadow={false}
                                disabled={!cvGeneratePdfHandler || pdfLoading}
                                loading={pdfLoading}
                                onClick={() => void handleGeneratePdfClick()}
                                className="!px-3 !py-2 text-sm"
                            >
                                Generate PDF
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
