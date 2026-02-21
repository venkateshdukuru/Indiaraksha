import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scamLookupAPI, scamReportsAPI } from '@/lib/api';

export default function Home() {
    const [checkValue, setCheckValue] = useState('');
    const [checkResult, setCheckResult] = useState<any>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [trendingScams, setTrendingScams] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const statsData = await scamReportsAPI.getStatistics();
            setStats(statsData);
            const trending = await scamReportsAPI.getTrending(5);
            setTrendingScams(trending);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const handleQuickCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!checkValue.trim()) return;
        setIsChecking(true);
        setCheckResult(null);
        try {
            const result = await scamLookupAPI.check(checkValue);
            setCheckResult(result);
        } catch (error: any) {
            setCheckResult({ found: false, message: error.message || 'Error checking this number/URL', error: true });
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                <div className="container-custom relative z-10 text-center max-w-4xl mx-auto">
                    <div className="inline-block mb-6 animate-fade-in">
                        <span className="bg-blue-500/10 border border-blue-500/30 text-blue-200 text-sm font-semibold px-4 py-1.5 rounded-full">
                            🇮🇳 Protecting India from Digital Fraud
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                        Stop Scams Before <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">They Stop You</span>
                    </h1>

                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        India's first community-driven platform to report, verify, and check fraudulent numbers, websites, and apps.
                    </p>

                    {/* Quick Check Form */}
                    <form onSubmit={handleQuickCheck} className="max-w-2xl mx-auto mb-8">
                        <div className="relative shadow-2xl rounded-2xl">
                            <input
                                type="text"
                                placeholder="Enter phone number or URL to check..."
                                className="w-full pl-6 pr-40 py-5 text-lg rounded-2xl border-2 border-transparent focus:border-blue-400 focus:outline-none text-gray-900"
                                value={checkValue}
                                onChange={(e) => setCheckValue(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={isChecking}
                                className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-70"
                            >
                                {isChecking ? 'Checking...' : '🔍 Check Now'}
                            </button>
                        </div>
                    </form>

                    {/* Quick Check Result */}
                    {checkResult && (
                        <div className={`max-w-2xl mx-auto p-6 rounded-xl ${checkResult.found ? 'bg-red-500/20 border-2 border-red-400' : 'bg-green-500/20 border-2 border-green-400'}`}>
                            <p className="text-lg font-bold">{checkResult.message}</p>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4 justify-center mt-10">
                        <Link to="/report" className="btn btn-danger text-lg px-8 py-4 rounded-xl shadow-xl">
                            🚨 Report a Scam
                        </Link>
                        <Link to="/lookup" className="btn bg-white text-blue-900 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl shadow-xl">
                            🔍 Check Database
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            {stats && (
                <section className="py-16 bg-gray-50">
                    <div className="container-custom">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="card text-center">
                                <div className="text-5xl font-bold text-blue-600 mb-2">{stats.totalReports?.toLocaleString() || '0'}</div>
                                <div className="text-gray-600 font-medium">Total Reports</div>
                            </div>
                            <div className="card text-center">
                                <div className="text-5xl font-bold text-red-600 mb-2">₹{(stats.totalAmountLost / 1000000).toFixed(1)}M</div>
                                <div className="text-gray-600 font-medium">Money Lost</div>
                            </div>
                            <div className="card text-center">
                                <div className="text-5xl font-bold text-green-600 mb-2">{stats.verifiedReports?.toLocaleString() || '0'}</div>
                                <div className="text-gray-600 font-medium">Verified Scams</div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Trending Scams */}
            {trendingScams.length > 0 && (
                <section className="py-16">
                    <div className="container-custom">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">🔥 Trending Scams</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trendingScams.map((scam, i) => (
                                <div key={i} className="card">
                                    <div className="text-sm text-gray-500 mb-2">{scam.scamType.replace(/_/g, ' ').toUpperCase()}</div>
                                    <p className="text-gray-800 line-clamp-3">{scam.description}</p>
                                    <div className="mt-4 text-sm text-red-600 font-bold">{scam.reportCount} reports</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="bg-blue-600 py-16 text-center text-white">
                <div className="container-custom">
                    <h2 className="text-4xl font-bold mb-4">Protect Yourself & Others</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of Indians fighting back against digital fraud.
                    </p>
                    <Link to="/report" className="btn bg-white text-blue-600 hover:bg-gray-100 font-bold px-10 py-4 rounded-xl shadow-lg text-lg">
                        Report Scam Now
                    </Link>
                </div>
            </section>
        </>
    );
}
