import { useState, useEffect } from 'react';
import { scamLookupAPI } from '@/lib/api';

export default function Lookup() {
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState<any>(null);
    const [topScammers, setTopScammers] = useState<any[]>([]);
    const [highRisk, setHighRisk] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [scammers, risk] = await Promise.all([
                scamLookupAPI.getTopScammers(10),
                scamLookupAPI.getHighRisk(10),
            ]);
            setTopScammers(scammers || []);
            setHighRisk(risk || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;

        setIsSearching(true);
        setSearchResult(null);

        try {
            const result = await scamLookupAPI.check(searchValue);
            setSearchResult(result);
        } catch (error: any) {
            setSearchResult({
                found: false,
                message: error.message || 'Error checking this number/URL',
                error: true,
            });
        } finally {
            setIsSearching(false);
        }
    };

    const getRiskBadge = (riskLevel: string) => {
        switch (riskLevel) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-green-100 text-green-800 border-green-200';
        }
    };

    return (
        <>
            {/* Enhanced Hero / Search Section */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white py-24 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg">
                            <span className="text-5xl">🔍</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            Check Any Number or URL
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
                            Instantly verify if a phone number, website, or UPI ID has been reported for scams
                        </p>

                        {/* Search Box */}
                        <div className="max-w-2xl mx-auto">
                            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-3">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        placeholder="Enter phone number, website URL, or UPI ID..."
                                        className="flex-1 px-6 py-4 text-lg text-gray-900 rounded-xl border-2 border-transparent focus:border-blue-500 focus:outline-none"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSearching}
                                        className="btn btn-primary px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                    >
                                        {isSearching ? '⏳ Checking...' : '🔍 Check Now'}
                                    </button>
                                </div>
                            </form>

                            {/* Quick Examples */}
                            <div className="mt-6 text-blue-100 text-sm">
                                <span className="opacity-75">Try examples:</span>
                                <span className="ml-2 px-3 py-1 bg-white/10 rounded-lg">+91 98765 43210</span>
                                <span className="ml-2 px-3 py-1 bg-white/10 rounded-lg">example@upi</span>
                                <span className="ml-2 px-3 py-1 bg-white/10 rounded-lg">scam-site.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Result */}
            {searchResult && (
                <div className="container-custom py-12">
                    <div className="max-w-3xl mx-auto animate-fade-in">
                        <div className={`p-8 rounded-2xl border ${searchResult.error ? 'bg-red-50 border-red-200' :
                            searchResult.found ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'
                            }`}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${searchResult.error ? 'bg-red-100 text-red-600' :
                                    searchResult.found ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                    {searchResult.found ? '⚠️' : searchResult.error ? '❌' : '✅'}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{searchResult.message}</h3>
                                    {!searchResult.error && !searchResult.found && (
                                        <p className="text-green-700">No reports found in our database.</p>
                                    )}
                                </div>
                            </div>

                            {searchResult.entity && (
                                <div className="bg-white/60 p-6 rounded-xl backdrop-blur-sm">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                        <div>
                                            <div className="text-gray-500 text-sm mb-1">Risk Level</div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getRiskBadge(searchResult.entity.riskLevel)}`}>
                                                {searchResult.entity.riskLevel?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 text-sm mb-1">Reports</div>
                                            <div className="text-2xl font-bold text-gray-900">{searchResult.entity.reportCount}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 text-sm mb-1">Score</div>
                                            <div className="text-2xl font-bold text-gray-900">{searchResult.entity.reputationScore}/100</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 text-sm mb-1">Losses</div>
                                            <div className="text-2xl font-bold text-gray-900">₹{searchResult.entity.totalAmountLost.toLocaleString()}</div>
                                        </div>
                                    </div>

                                    {searchResult.entity.scamCategories?.length > 0 && (
                                        <div>
                                            <div className="text-gray-500 text-sm mb-2">Flagged As:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {searchResult.entity.scamCategories.map((type: string, i: number) => (
                                                    <span key={i} className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200">
                                                        {type.replace(/_/g, ' ').toUpperCase()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!searchResult.found && !searchResult.error && (
                                <div className="mt-4 p-4 bg-green-100/50 rounded-lg text-green-800 text-sm">
                                    <strong>Note:</strong> Even if no reports are found, always verify before making payments. Scammers change numbers frequently.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Lists Section */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Top Scammers List */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-2xl">🚨</span>
                            <h2 className="text-2xl font-bold text-gray-900">Most Reported</h2>
                        </div>

                        <div className="space-y-4">
                            {topScammers.length > 0 ? topScammers.map((scammer, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-start justify-between">
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 mb-1">{scammer.entityType.toUpperCase()}</div>
                                        <div className="font-mono font-medium text-gray-900 mb-2">{scammer.entityValue}</div>
                                        <div className="flex gap-4 text-sm text-gray-500">
                                            <span>Reports: <strong className="text-gray-900">{scammer.reportCount}</strong></span>
                                            <span>Loss: <strong className="text-gray-900">₹{scammer.totalAmountLost.toLocaleString()}</strong></span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getRiskBadge(scammer.riskLevel)}`}>
                                        {scammer.riskLevel.toUpperCase()}
                                    </span>
                                </div>
                            )) : (
                                <div className="text-gray-400 text-center py-10 bg-gray-50 rounded-xl">No data available</div>
                            )}
                        </div>
                    </div>

                    {/* Recent High Risk */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-2xl">⚠️</span>
                            <h2 className="text-2xl font-bold text-gray-900">High Risk Alerts</h2>
                        </div>

                        <div className="space-y-4">
                            {highRisk.length > 0 ? highRisk.map((entity, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getRiskBadge(entity.riskLevel)}`}>
                                            {entity.riskLevel.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-gray-400">{new Date(entity.lastReportedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="font-mono font-medium text-gray-900 mb-3">{entity.entityValue}</div>
                                    {entity.scamCategories?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {entity.scamCategories.slice(0, 3).map((cat: string, j: number) => (
                                                <span key={j} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">
                                                    {cat.replace(/_/g, ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="text-gray-400 text-center py-10 bg-gray-50 rounded-xl">No data available</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
