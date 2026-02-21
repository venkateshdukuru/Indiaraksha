import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scamLookupAPI, scamReportsAPI } from '@/lib/api';

export default function Home() {
    const [checkValue, setCheckValue] = useState('');
    const [checkResult, setCheckResult] = useState<any>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [trendingScams, setTrendingScams] = useState<any[]>([]);

    useEffect(() => { fetchDashboardData(); }, []);

    const fetchDashboardData = async () => {
        try {
            const statsData = await scamReportsAPI.getStatistics();
            setStats(statsData);
            const trending = await scamReportsAPI.getTrending(6);
            setTrendingScams(trending);
        } catch (e) { /* offline – show static UI */ }
    };

    const handleQuickCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!checkValue.trim()) return;
        setIsChecking(true); setCheckResult(null);
        try {
            setCheckResult(await scamLookupAPI.check(checkValue));
        } catch (err: any) {
            setCheckResult({ found: false, message: err.message || 'Error checking this entry', error: true });
        } finally { setIsChecking(false); }
    };

    const FEATURES = [
        { icon: '🚨', title: 'Report Scams', desc: 'File a detailed report in minutes. Helps warn thousands instantly.', to: '/report', color: 'feature-card--red' },
        { icon: '🔍', title: 'Check Any Number', desc: 'Search our database before picking up or paying.', to: '/lookup', color: 'feature-card--blue' },
        { icon: '🔔', title: 'Live Alerts', desc: 'Real-time warnings for your city and state.', to: '/alerts', color: 'feature-card--orange' },
    ];

    return (
        <>
            {/* ── Hero ── */}
            <section className="hero">
                <div className="hero__glow hero__glow--1" />
                <div className="hero__glow hero__glow--2" />
                <div className="container-custom hero__inner">
                    <div className="hero__badge animate-fade-in">
                        🇮🇳 Protecting India from Digital Fraud
                    </div>
                    <h1 className="hero__title animate-fade-in">
                        Stop Scams Before<br />
                        <span className="hero__title-accent">They Stop You</span>
                    </h1>
                    <p className="hero__subtitle animate-fade-in">
                        India's first community-driven platform to report, verify, and check fraudulent numbers, websites, and apps — free and anonymous.
                    </p>

                    {/* Quick Check */}
                    <form onSubmit={handleQuickCheck} className="hero__search animate-fade-in">
                        <input
                            type="text"
                            placeholder="Enter phone number, UPI ID or website URL…"
                            className="hero__search-input"
                            value={checkValue}
                            onChange={e => setCheckValue(e.target.value)}
                        />
                        <button type="submit" disabled={isChecking} className="hero__search-btn">
                            {isChecking ? '⏳ Checking…' : '🔍 Check Now'}
                        </button>
                    </form>

                    {checkResult && (
                        <div className={`hero__result animate-fade-in ${checkResult.found ? 'hero__result--danger' : checkResult.error ? 'hero__result--warn' : 'hero__result--safe'}`}>
                            <span className="hero__result-icon">{checkResult.found ? '⚠️' : checkResult.error ? '❌' : '✅'}</span>
                            <span>{checkResult.message}</span>
                        </div>
                    )}

                    <div className="hero__ctas animate-fade-in">
                        <Link to="/report" className="cta-btn cta-btn--danger">🚨 Report a Scam</Link>
                        <Link to="/lookup" className="cta-btn cta-btn--ghost">🔍 Check Database</Link>
                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
            {stats && (
                <section className="stats-section">
                    <div className="container-custom stats-grid">
                        <div className="stat-card">
                            <div className="stat-card__number stat-card__number--blue">{stats.totalReports?.toLocaleString() ?? '0'}</div>
                            <div className="stat-card__label">Total Reports</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__number stat-card__number--red">₹{((stats.totalAmountLost || 0) / 1_000_000).toFixed(1)}M</div>
                            <div className="stat-card__label">Money Reported Lost</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__number stat-card__number--green">{stats.verifiedReports?.toLocaleString() ?? '0'}</div>
                            <div className="stat-card__label">Verified Scams</div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Feature Cards ── */}
            <section className="features-section">
                <div className="container-custom">
                    <div className="section-header">
                        <h2 className="section-title">How IndiaRaksha Protects You</h2>
                        <p className="section-subtitle">Three powerful tools to fight fraud — all free, all anonymous</p>
                    </div>
                    <div className="features-grid">
                        {FEATURES.map(f => (
                            <Link key={f.to} to={f.to} className={`feature-card ${f.color}`}>
                                <div className="feature-card__icon">{f.icon}</div>
                                <h3 className="feature-card__title">{f.title}</h3>
                                <p className="feature-card__desc">{f.desc}</p>
                                <span className="feature-card__link">Learn more →</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Trending Scams ── */}
            {trendingScams.length > 0 && (
                <section className="trending-section">
                    <div className="container-custom">
                        <div className="section-header">
                            <span className="section-tag">🔥 Live Feed</span>
                            <h2 className="section-title">Trending Scams Right Now</h2>
                        </div>
                        <div className="trending-grid">
                            {trendingScams.map((scam, i) => (
                                <div key={i} className="trending-card">
                                    <div className="trending-card__type">{scam.scamType?.replace(/_/g, ' ').toUpperCase()}</div>
                                    <p className="trending-card__desc">{scam.description}</p>
                                    <div className="trending-card__footer">
                                        <span className="trending-card__count">⚠️ {scam.reportCount} reports</span>
                                        {scam.state && <span className="trending-card__loc">📍 {scam.state}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA Banner ── */}
            <section className="cta-banner">
                <div className="container-custom cta-banner__inner">
                    <div>
                        <h2 className="cta-banner__title">Protect Yourself &amp; Others</h2>
                        <p className="cta-banner__sub">Join thousands of Indians fighting back against digital fraud.</p>
                    </div>
                    <Link to="/report" className="cta-btn cta-btn--white">Report Scam Now →</Link>
                </div>
            </section>
        </>
    );
}
