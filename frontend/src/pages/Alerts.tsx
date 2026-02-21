import { useState, useEffect } from 'react';
import { alertsAPI } from '@/lib/api';

export default function Alerts() {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                // Backend getAll() returns  { alerts: Alert[], pagination: {...} }
                // getActive() returns a plain Alert[]
                // Handle both shapes gracefully
                const data = await alertsAPI.getAll({ limit: 50 });
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.alerts)
                        ? data.alerts
                        : [];
                setAlerts(list);
            } catch (err: any) {
                console.error('Alerts fetch error:', err);
                // Fallback to /alerts/active which returns a plain array
                try {
                    const active = await alertsAPI.getActive();
                    setAlerts(Array.isArray(active) ? active : []);
                } catch (err2: any) {
                    setApiError(err2?.message || 'Could not connect to the server');
                    setAlerts([]);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    const severityClass = (s: string) => {
        switch (s) {
            case 'critical': return 'alert-card alert-card--critical';
            case 'warning': return 'alert-card alert-card--warning';
            default: return 'alert-card alert-card--info';
        }
    };

    const severityBadge = (s: string) => {
        switch (s) {
            case 'critical': return 'severity-badge severity-badge--critical';
            case 'warning': return 'severity-badge severity-badge--warning';
            default: return 'severity-badge severity-badge--info';
        }
    };

    return (
        <>
            {/* ── Hero ── */}
            <section className="page-hero page-hero--orange">
                <div className="page-hero__dots" />
                <div className="container-custom page-hero__inner">
                    <div className="page-hero__icon">⚠️</div>
                    <h1 className="page-hero__title">Fraud Alerts</h1>
                    <p className="page-hero__sub">Stay informed about the latest scam alerts and fraud warnings across India</p>
                    <div className="page-hero__stats">
                        <div className="page-hero__stat">
                            <span className="page-hero__stat-num">{alerts.length}</span>
                            <span className="page-hero__stat-label">Active Alerts</span>
                        </div>
                        <div className="page-hero__stat">
                            <span className="page-hero__stat-num">24/7</span>
                            <span className="page-hero__stat-label">Monitoring</span>
                        </div>
                        <div className="page-hero__stat">
                            <span className="page-hero__stat-num">Real-time</span>
                            <span className="page-hero__stat-label">Updates</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Alerts List ── */}
            <section className="alerts-section">
                <div className="container-custom alerts-inner">
                    {loading ? (
                        <>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="alert-card alert-card--skeleton">
                                    <div className="skeleton-line skeleton-line--wide" />
                                    <div className="skeleton-line skeleton-line--mid" />
                                    <div className="skeleton-line skeleton-line--full" />
                                </div>
                            ))}
                        </>
                    ) : alerts.length > 0 ? (
                        alerts.map(alert => (
                            <div key={alert._id} className={severityClass(alert.severity) + ' animate-slide-up'}>
                                <div className="alert-card__head">
                                    <span className={severityBadge(alert.severity)}>{alert.severity?.toUpperCase()}</span>
                                    <span className="alert-card__date">{new Date(alert.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <h3 className="alert-card__title">{alert.title}</h3>
                                <p className="alert-card__msg">{alert.message}</p>
                                {(alert.city || alert.state) && (
                                    <div className="alert-card__location">
                                        📍 {[alert.city, alert.state].filter(Boolean).join(', ')}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : apiError ? (
                        <div className="alerts-empty">
                            <div className="alerts-empty__icon">🔌</div>
                            <h3 className="alerts-empty__title">Cannot Connect to Server</h3>
                            <p className="alerts-empty__sub">Make sure the backend is running, then refresh.</p>
                            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.5rem' }}>{apiError}</p>
                        </div>
                    ) : (
                        <div className="alerts-empty">
                            <div className="alerts-empty__icon">✅</div>
                            <h3 className="alerts-empty__title">No Active Alerts</h3>
                            <p className="alerts-empty__sub">There are currently no active fraud alerts. Stay safe!</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
