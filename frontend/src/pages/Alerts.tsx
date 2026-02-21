import { useState, useEffect } from 'react';
import { alertsAPI } from '@/lib/api';

export default function Alerts() {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const data = await alertsAPI.getAll();
                setAlerts(data);
            } catch (err) {
                console.error('Failed to fetch alerts', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <>
            {/* Enhanced Hero Section */}
            <div className="relative bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white py-20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="container-custom relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg">
                            <span className="text-5xl">⚠️</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            Fraud Alerts
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-orange-100 mb-8 leading-relaxed">
                            Stay informed about the latest scam alerts and fraud warnings in your area
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                                <div className="text-2xl font-bold">{alerts.length}</div>
                                <div className="text-orange-100 text-sm">Active Alerts</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                                <div className="text-2xl font-bold">24/7</div>
                                <div className="text-orange-100 text-sm">Monitoring</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                                <div className="text-2xl font-bold">Real-time</div>
                                <div className="text-orange-100 text-sm">Updates</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-custom py-12">

                {loading ? (
                    <div className="grid gap-6 max-w-4xl mx-auto">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-20 bg-gray-200 rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : alerts.length > 0 ? (
                    <div className="grid gap-6 max-w-4xl mx-auto">
                        {alerts.map((alert) => (
                            <div key={alert._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow animate-slide-up">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(alert.severity)} uppercase tracking-wide`}>
                                                {alert.severity}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(alert.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">{alert.title}</h3>
                                    </div>
                                </div>

                                <p className="text-gray-600 leading-relaxed mb-4">
                                    {alert.message}
                                </p>

                                {(alert.city || alert.state) && (
                                    <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-2 rounded-lg inline-block">
                                        <span className="mr-1">📍</span>
                                        {alert.city && <span className="mr-1">{alert.city},</span>}
                                        {alert.state && <span>{alert.state}</span>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm max-w-3xl mx-auto">
                        <div className="text-6xl mb-4">✅</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Alerts</h3>
                        <p className="text-gray-500">There are currently no active fraud alerts for your region.</p>
                    </div>
                )}
            </div>

        </>
    );
}
