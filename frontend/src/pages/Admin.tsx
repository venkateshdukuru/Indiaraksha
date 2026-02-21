import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, authAPI } from '@/lib/api';

type Tab = 'overview' | 'reports' | 'users';

const SCAM_TYPE_LABELS: Record<string, string> = {
    upi_scam: '💳 UPI Scam', whatsapp_fraud: '💬 WhatsApp', fake_job: '💼 Fake Job',
    phishing_website: '🌐 Phishing', loan_app_harassment: '💰 Loan App', sms_scam: '📱 SMS',
    email_scam: '📧 Email', investment_fraud: '📈 Investment', lottery_scam: '🎰 Lottery',
    romance_scam: '❤️ Romance', other: '🔍 Other',
};

export default function Admin() {
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>('overview');
    const [stats, setStats] = useState<any>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingReports, setLoadingReports] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [actionMsg, setActionMsg] = useState('');
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    // Guard: admin only
    useEffect(() => {
        const user = authAPI.getCurrentUser();
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
    }, [navigate]);

    // Load dashboard stats
    useEffect(() => {
        adminAPI.getDashboard()
            .then(d => setStats(d))
            .catch(() => { })
            .finally(() => setLoadingStats(false));
    }, []);

    // Load reports when tab switches or filter changes
    const loadReports = useCallback(async () => {
        setLoadingReports(true);
        try {
            const data = await adminAPI.getAllReports(1, 100, statusFilter || undefined);
            setReports(Array.isArray(data?.reports) ? data.reports : []);
        } catch { setReports([]); }
        finally { setLoadingReports(false); }
    }, [statusFilter]);

    // Load users
    const loadUsers = useCallback(async () => {
        setLoadingUsers(true);
        try {
            const data = await adminAPI.getUsers(1, 100);
            setUsers(Array.isArray(data?.users) ? data.users : []);
        } catch { setUsers([]); }
        finally { setLoadingUsers(false); }
    }, []);

    useEffect(() => { if (tab === 'reports') loadReports(); }, [tab, loadReports]);
    useEffect(() => { if (tab === 'users') loadUsers(); }, [tab, loadUsers]);

    const flash = (msg: string) => { setActionMsg(msg); setTimeout(() => setActionMsg(''), 3000); };

    const handleDelete = async (id: string) => {
        try {
            await adminAPI.deleteReport(id);
            setReports(r => r.filter(x => x._id !== id));
            flash('✅ Report deleted');
            if (stats) setStats((s: any) => ({ ...s, reports: { ...s.reports, total: s.reports.total - 1 } }));
        } catch { flash('❌ Failed to delete'); }
        setConfirmDelete(null);
    };

    const handleVerify = async (id: string) => {
        try {
            await adminAPI.verifyReport(id);
            setReports(r => r.map(x => x._id === id ? { ...x, status: 'verified' } : x));
            flash('✅ Report verified');
        } catch { flash('❌ Failed to verify'); }
    };

    const handleReject = async (id: string) => {
        try {
            await adminAPI.rejectReport(id, 'Rejected by admin');
            setReports(r => r.map(x => x._id === id ? { ...x, status: 'rejected' } : x));
            flash('✅ Report rejected');
        } catch { flash('❌ Failed to reject'); }
    };

    const handleToggleUser = async (user: any) => {
        try {
            if (user.isActive) {
                await adminAPI.deactivateUser(user._id);
                setUsers(u => u.map(x => x._id === user._id ? { ...x, isActive: false } : x));
                flash('✅ User deactivated');
            } else {
                await adminAPI.activateUser(user._id);
                setUsers(u => u.map(x => x._id === user._id ? { ...x, isActive: true } : x));
                flash('✅ User activated');
            }
        } catch { flash('❌ Action failed'); }
    };

    const statusBadge = (s: string) => {
        const map: Record<string, string> = {
            pending: 'admin-badge admin-badge--warn',
            verified: 'admin-badge admin-badge--ok',
            rejected: 'admin-badge admin-badge--danger',
        };
        return map[s] || 'admin-badge admin-badge--info';
    };

    const roleBadge = (r: string) => r === 'admin'
        ? 'admin-badge admin-badge--danger' : r === 'moderator'
            ? 'admin-badge admin-badge--warn' : 'admin-badge admin-badge--info';

    return (
        <div className="admin-page">

            {/* ── Sidebar ── */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar__brand">
                    <span className="admin-sidebar__logo">🛡️</span>
                    <div>
                        <div className="admin-sidebar__title">IndiaRaksha</div>
                        <div className="admin-sidebar__sub">Admin Panel</div>
                    </div>
                </div>
                <nav className="admin-nav">
                    {(['overview', 'reports', 'users'] as Tab[]).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`admin-nav__item ${tab === t ? 'admin-nav__item--active' : ''}`}>
                            {t === 'overview' && '📊'} {t === 'reports' && '📋'} {t === 'users' && '👥'}
                            {' '}{t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </nav>
                <button className="admin-nav__item admin-nav__item--logout"
                    onClick={() => { authAPI.logout(); navigate('/login'); }}>
                    🚪 Logout
                </button>
            </aside>

            {/* ── Main Content ── */}
            <main className="admin-main">

                {/* Toast */}
                {actionMsg && (
                    <div className="admin-toast animate-fade-in">{actionMsg}</div>
                )}

                {/* Confirm Delete Modal */}
                {confirmDelete && (
                    <div className="admin-modal-overlay">
                        <div className="admin-modal">
                            <div className="admin-modal__icon">🗑️</div>
                            <h3 className="admin-modal__title">Delete Report?</h3>
                            <p className="admin-modal__sub">This action cannot be undone.</p>
                            <div className="admin-modal__btns">
                                <button className="admin-btn admin-btn--ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
                                <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── OVERVIEW TAB ── */}
                {tab === 'overview' && (
                    <div className="admin-section animate-fade-in">
                        <h1 className="admin-heading">Dashboard Overview</h1>
                        <p className="admin-subhead">Platform statistics at a glance</p>

                        {loadingStats ? (
                            <div className="admin-loading">Loading statistics…</div>
                        ) : stats ? (
                            <>
                                {/* Stat cards */}
                                <div className="admin-stats">
                                    <div className="admin-stat admin-stat--blue">
                                        <div className="admin-stat__icon">👥</div>
                                        <div className="admin-stat__num">{stats.users?.total ?? 0}</div>
                                        <div className="admin-stat__label">Total Users</div>
                                        <div className="admin-stat__today">+{stats.users?.today ?? 0} today</div>
                                    </div>
                                    <div className="admin-stat admin-stat--red">
                                        <div className="admin-stat__icon">📋</div>
                                        <div className="admin-stat__num">{stats.reports?.total ?? 0}</div>
                                        <div className="admin-stat__label">Total Reports</div>
                                        <div className="admin-stat__today">+{stats.reports?.today ?? 0} today</div>
                                    </div>
                                    <div className="admin-stat admin-stat--orange">
                                        <div className="admin-stat__icon">⏳</div>
                                        <div className="admin-stat__num">{stats.reports?.pending ?? 0}</div>
                                        <div className="admin-stat__label">Pending Review</div>
                                        <div className="admin-stat__today">Needs action</div>
                                    </div>
                                    <div className="admin-stat admin-stat--green">
                                        <div className="admin-stat__icon">✅</div>
                                        <div className="admin-stat__num">{stats.reports?.verified ?? 0}</div>
                                        <div className="admin-stat__label">Verified</div>
                                        <div className="admin-stat__today">{stats.reports?.rejected ?? 0} rejected</div>
                                    </div>
                                </div>

                                {/* Quick action buttons */}
                                <div className="admin-quick-actions">
                                    <h2 className="admin-section-title">Quick Actions</h2>
                                    <div className="admin-action-grid">
                                        <button className="admin-action-card" onClick={() => setTab('reports')}>
                                            <span className="admin-action-card__icon">📋</span>
                                            <span className="admin-action-card__label">Manage Reports</span>
                                            <span className="admin-action-card__count">{stats.reports?.pending} pending</span>
                                        </button>
                                        <button className="admin-action-card" onClick={() => setTab('users')}>
                                            <span className="admin-action-card__icon">👥</span>
                                            <span className="admin-action-card__label">Manage Users</span>
                                            <span className="admin-action-card__count">{stats.users?.total} total</span>
                                        </button>
                                        <button className="admin-action-card" onClick={() => { setTab('reports'); setStatusFilter('pending'); }}>
                                            <span className="admin-action-card__icon">⚡</span>
                                            <span className="admin-action-card__label">Review Pending</span>
                                            <span className="admin-action-card__count">Verify or reject</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="admin-empty">⚡ Could not load stats. Is the backend running?</div>
                        )}
                    </div>
                )}

                {/* ── REPORTS TAB ── */}
                {tab === 'reports' && (
                    <div className="admin-section animate-fade-in">
                        <div className="admin-tab-header">
                            <div>
                                <h1 className="admin-heading">Scam Reports</h1>
                                <p className="admin-subhead">{reports.length} report{reports.length !== 1 ? 's' : ''} {statusFilter ? `(${statusFilter})` : '(all)'}</p>
                            </div>
                            <div className="admin-filters">
                                {['', 'pending', 'verified', 'rejected'].map(s => (
                                    <button key={s}
                                        className={`admin-filter-btn ${statusFilter === s ? 'admin-filter-btn--active' : ''}`}
                                        onClick={() => setStatusFilter(s)}>
                                        {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loadingReports ? (
                            <div className="admin-loading">Loading reports…</div>
                        ) : reports.length === 0 ? (
                            <div className="admin-empty">No reports found.</div>
                        ) : (
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Identifier</th>
                                            <th>Reported By</th>
                                            <th>Amount Lost</th>
                                            <th>Location</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.map(r => (
                                            <tr key={r._id}>
                                                <td><span className="admin-type-tag">{SCAM_TYPE_LABELS[r.scamType] || r.scamType}</span></td>
                                                <td className="admin-mono">{r.phoneNumber || r.url || r.appName || '—'}</td>
                                                <td>{r.isAnonymous ? <em className="admin-muted">Anonymous</em> : (r.reportedBy?.name || '—')}</td>
                                                <td>{r.amountLost ? `₹${r.amountLost.toLocaleString('en-IN')}` : '—'}</td>
                                                <td>{[r.city, r.state].filter(Boolean).join(', ') || '—'}</td>
                                                <td className="admin-muted">{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                                                <td><span className={statusBadge(r.status)}>{r.status}</span></td>
                                                <td>
                                                    <div className="admin-row-actions">
                                                        {r.status === 'pending' && (
                                                            <>
                                                                <button className="admin-btn admin-btn--ok admin-btn--sm" onClick={() => handleVerify(r._id)}>✓ Verify</button>
                                                                <button className="admin-btn admin-btn--warn admin-btn--sm" onClick={() => handleReject(r._id)}>✗ Reject</button>
                                                            </>
                                                        )}
                                                        <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => setConfirmDelete(r._id)}>🗑️</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ── USERS TAB ── */}
                {tab === 'users' && (
                    <div className="admin-section animate-fade-in">
                        <div className="admin-tab-header">
                            <div>
                                <h1 className="admin-heading">Users</h1>
                                <p className="admin-subhead">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>

                        {loadingUsers ? (
                            <div className="admin-loading">Loading users…</div>
                        ) : users.length === 0 ? (
                            <div className="admin-empty">No users found.</div>
                        ) : (
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Mobile</th>
                                            <th>Role</th>
                                            <th>Location</th>
                                            <th>Joined</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u._id}>
                                                <td><strong>{u.name}</strong></td>
                                                <td className="admin-mono">{u.email}</td>
                                                <td className="admin-mono">{u.mobile}</td>
                                                <td><span className={roleBadge(u.role)}>{u.role}</span></td>
                                                <td>{[u.city, u.state].filter(Boolean).join(', ') || '—'}</td>
                                                <td className="admin-muted">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                                                <td>
                                                    <span className={u.isActive ? 'admin-badge admin-badge--ok' : 'admin-badge admin-badge--danger'}>
                                                        {u.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {u.role !== 'admin' && (
                                                        <button
                                                            className={`admin-btn admin-btn--sm ${u.isActive ? 'admin-btn--warn' : 'admin-btn--ok'}`}
                                                            onClick={() => handleToggleUser(u)}>
                                                            {u.isActive ? '🔒 Deactivate' : '🔓 Activate'}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
