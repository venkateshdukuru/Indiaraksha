import { useState, useEffect } from 'react';
import { scamLookupAPI } from '@/lib/api';

export default function Lookup() {
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState<any>(null);
    const [topScammers, setTopScammers] = useState<any[]>([]);
    const [highRisk, setHighRisk] = useState<any[]>([]);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [scammers, risk] = await Promise.all([scamLookupAPI.getTopScammers(10), scamLookupAPI.getHighRisk(10)]);
            setTopScammers(scammers || []);
            setHighRisk(risk || []);
        } catch { /* offline */ }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;
        setIsSearching(true); setSearchResult(null);
        try {
            setSearchResult(await scamLookupAPI.check(searchValue));
        } catch (error: any) {
            setSearchResult({ found: false, message: error.message || 'Error checking this number/URL', error: true });
        } finally { setIsSearching(false); }
    };

    const riskClass = (level: string) => {
        switch (level) {
            case 'critical': return 'risk-badge risk-badge--critical';
            case 'high': return 'risk-badge risk-badge--high';
            case 'medium': return 'risk-badge risk-badge--medium';
            case 'low': return 'risk-badge risk-badge--low';
            default: return 'risk-badge risk-badge--safe';
        }
    };

    return (
        <>
            {/* ── Hero ── */}
            <section className="page-hero page-hero--blue">
                <div className="page-hero__dots" />
                <div className="container-custom page-hero__inner">
                    <div className="page-hero__icon">🔍</div>
                    <h1 className="page-hero__title">Check Any Number or URL</h1>
                    <p className="page-hero__sub">Instantly verify if a phone number, website, or UPI ID has been reported for scams</p>

                    <form onSubmit={handleSearch} className="lookup-search">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            placeholder="Enter phone number, website URL, or UPI ID…"
                            className="lookup-search__input"
                            required
                        />
                        <button type="submit" disabled={isSearching} className="lookup-search__btn">
                            {isSearching ? '⏳ Checking…' : '🔍 Check'}
                        </button>
                    </form>

                    <div className="lookup-examples">
                        <span>Try:</span>
                        <span className="lookup-pill" onClick={() => setSearchValue('+91 98765 43210')}>+91 98765 43210</span>
                        <span className="lookup-pill" onClick={() => setSearchValue('example@upi')}>example@upi</span>
                        <span className="lookup-pill" onClick={() => setSearchValue('scam-site.com')}>scam-site.com</span>
                    </div>
                </div>
            </section>

            {/* ── Result ── */}
            {searchResult && (
                <div className="container-custom" style={{ paddingTop: '2.5rem', paddingBottom: '1rem' }}>
                    <div className={`result-card animate-fade-in ${searchResult.error ? 'result-card--error' : searchResult.found ? 'result-card--danger' : 'result-card--safe'}`}>
                        <div className="result-card__head">
                            <span className="result-card__emoji">{searchResult.found ? '⚠️' : searchResult.error ? '❌' : '✅'}</span>
                            <div>
                                <h3 className="result-card__msg">{searchResult.message}</h3>
                                {!searchResult.error && !searchResult.found && (
                                    <p className="result-card__note">No reports found. Stay vigilant — always verify before paying.</p>
                                )}
                            </div>
                        </div>

                        {searchResult.entity && (
                            <div className="result-stats">
                                <div className="result-stat">
                                    <div className="result-stat__label">Risk Level</div>
                                    <span className={riskClass(searchResult.entity.riskLevel)}>{searchResult.entity.riskLevel?.toUpperCase()}</span>
                                </div>
                                <div className="result-stat">
                                    <div className="result-stat__label">Reports</div>
                                    <div className="result-stat__value">{searchResult.entity.reportCount}</div>
                                </div>
                                <div className="result-stat">
                                    <div className="result-stat__label">Score</div>
                                    <div className="result-stat__value">{searchResult.entity.reputationScore}/100</div>
                                </div>
                                <div className="result-stat">
                                    <div className="result-stat__label">Total Loss</div>
                                    <div className="result-stat__value">₹{searchResult.entity.totalAmountLost?.toLocaleString()}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Two-column lists ── */}
            <section className="lookup-lists">
                <div className="container-custom lookup-lists__grid">
                    {/* Most Reported */}
                    <div>
                        <h2 className="lookup-list-title">🚨 Most Reported</h2>
                        <div className="lookup-list">
                            {topScammers.length > 0 ? topScammers.map((s, i) => (
                                <div key={i} className="lookup-list__item">
                                    <div className="lookup-list__rank">#{i + 1}</div>
                                    <div className="lookup-list__body">
                                        <div className="lookup-list__type">{s.entityType?.toUpperCase()}</div>
                                        <div className="lookup-list__value">{s.entityValue}</div>
                                        <div className="lookup-list__meta">
                                            <span>{s.reportCount} reports</span>
                                            <span>₹{s.totalAmountLost?.toLocaleString()} lost</span>
                                        </div>
                                    </div>
                                    <span className={riskClass(s.riskLevel)}>{s.riskLevel?.toUpperCase()}</span>
                                </div>
                            )) : (
                                <div className="lookup-list__empty">No data yet</div>
                            )}
                        </div>
                    </div>

                    {/* High Risk */}
                    <div>
                        <h2 className="lookup-list-title">⚠️ High Risk Alerts</h2>
                        <div className="lookup-list">
                            {highRisk.length > 0 ? highRisk.map((e, i) => (
                                <div key={i} className="lookup-list__item">
                                    <div className="lookup-list__body">
                                        <div className="lookup-list__sub">{new Date(e.lastReportedAt).toLocaleDateString()}</div>
                                        <div className="lookup-list__value">{e.entityValue}</div>
                                        <div className="lookup-list__tags">
                                            {e.scamCategories?.slice(0, 3).map((c: string, j: number) => (
                                                <span key={j} className="lookup-tag">{c.replace(/_/g, ' ')}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className={riskClass(e.riskLevel)}>{e.riskLevel?.toUpperCase()}</span>
                                </div>
                            )) : (
                                <div className="lookup-list__empty">No data yet</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
