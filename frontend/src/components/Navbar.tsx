import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
            <div className="container-custom">
                <div className="flex items-center justify-between h-24">

                    {/* Logo Section */}
                    <Link to="/" className="flex items-center group">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:bg-blue-700 transition-colors mr-3">
                            <span className="text-3xl">🛡️</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-gray-900 tracking-tight leading-none">IndiaRaksha</span>
                            <span className="text-xs text-blue-600 font-semibold tracking-wide uppercase mt-0.5">Fraud Protection</span>
                        </div>
                    </Link>

                    {/* Main Navigation Links - Increased Spacing & Size */}
                    <div className="hidden md:flex items-center space-x-12">
                        <Link
                            to="/"
                            className="text-lg font-medium text-gray-600 hover:text-blue-600 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600"
                        >
                            Home
                        </Link>
                        <Link
                            to="/report"
                            className="text-lg font-medium text-gray-600 hover:text-blue-600 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600"
                        >
                            Report Scam
                        </Link>
                        <Link
                            to="/lookup"
                            className="text-lg font-medium text-gray-600 hover:text-blue-600 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600"
                        >
                            Check Number
                        </Link>
                        <Link
                            to="/alerts"
                            className="text-lg font-medium text-gray-600 hover:text-blue-600 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600"
                        >
                            Alerts
                        </Link>
                    </div>

                    {/* Auth Buttons - Separated for Emphasis */}
                    <div className="hidden md:flex items-center space-x-6">
                        {typeof window !== 'undefined' && localStorage.getItem('accessToken') ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="text-lg font-semibold text-gray-900 hover:text-blue-700 transition-colors"
                                >
                                    My Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('accessToken');
                                        localStorage.removeItem('refreshToken');
                                        localStorage.removeItem('user');
                                        window.location.href = '/';
                                    }}
                                    className="text-lg font-semibold text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-lg font-semibold text-gray-900 hover:text-blue-700 transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn btn-primary text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-bold"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button (Placeholder) */}
                    <div className="md:hidden">
                        <button className="text-gray-500 hover:text-gray-900 focus:outline-none">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
