import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md mr-3">
                                <span className="text-2xl">🛡️</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">IndiaRaksha</span>
                        </div>
                        <p className="text-gray-600 mb-4 max-w-md">
                            India's first community-driven platform to report, verify, and check fraudulent numbers, websites, and apps.
                        </p>
                        <p className="text-sm text-gray-500">
                            🇮🇳 Protecting India from Digital Fraud
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/report" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Report Scam
                                </Link>
                            </li>
                            <li>
                                <Link to="/lookup" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Check Number
                                </Link>
                            </li>
                            <li>
                                <Link to="/alerts" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Fraud Alerts
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Account</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} IndiaRaksha. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
