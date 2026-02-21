import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const isActive = (path: string) =>
        location.pathname === path ? 'nav-link nav-link--active' : 'nav-link';

    return (
        <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
            <div className="navbar__inner">

                {/* ── Logo ── */}
                <Link to="/" className="navbar__logo">
                    <img src="/logo.svg" alt="IndiaRaksha" className="navbar__logo-icon" width="38" height="38" />
                    <div className="navbar__logo-text">
                        <span className="navbar__logo-name">IndiaRaksha</span>
                        <span className="navbar__logo-tagline">Fraud Protection</span>
                    </div>
                </Link>

                {/* ── Desktop Nav Links ── */}
                <nav className="navbar__links" aria-label="Main navigation">
                    <Link to="/" className={isActive('/')}>Home</Link>
                    <Link to="/report" className={isActive('/report')}>Report Scam</Link>
                    <Link to="/lookup" className={isActive('/lookup')}>Check Number</Link>
                    <Link to="/alerts" className={isActive('/alerts')}>
                        <span className="nav-link__alert-dot" aria-hidden="true" />
                        Alerts
                    </Link>
                </nav>

                {/* ── Desktop Auth Actions ── */}
                <div className="navbar__actions">
                    {isLoggedIn ? (
                        <>
                            <Link to="/profile" className="navbar__action-ghost">My Profile</Link>
                            <button
                                className="navbar__action-logout"
                                onClick={() => {
                                    localStorage.removeItem('accessToken');
                                    localStorage.removeItem('refreshToken');
                                    localStorage.removeItem('user');
                                    window.location.href = '/';
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar__action-ghost">Log In</Link>
                            <Link to="/register" className="navbar__action-cta">Get Started</Link>
                        </>
                    )}
                </div>

                {/* ── Mobile Hamburger ── */}
                <button
                    className={`navbar__hamburger${mobileOpen ? ' navbar__hamburger--open' : ''}`}
                    aria-label="Toggle menu"
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen(v => !v)}
                >
                    <span /><span /><span />
                </button>
            </div>

            {/* ── Mobile Drawer ── */}
            <div className={`navbar__mobile${mobileOpen ? ' navbar__mobile--open' : ''}`} aria-hidden={!mobileOpen}>
                <nav className="navbar__mobile-links">
                    <Link to="/" className={isActive('/')}>🏠 Home</Link>
                    <Link to="/report" className={isActive('/report')}>🚨 Report Scam</Link>
                    <Link to="/lookup" className={isActive('/lookup')}>🔍 Check Number</Link>
                    <Link to="/alerts" className={isActive('/alerts')}>🔔 Alerts</Link>
                </nav>
                <div className="navbar__mobile-actions">
                    {isLoggedIn ? (
                        <>
                            <Link to="/profile" className="navbar__action-ghost">My Profile</Link>
                            <button
                                className="navbar__action-logout"
                                onClick={() => {
                                    localStorage.removeItem('accessToken');
                                    localStorage.removeItem('refreshToken');
                                    localStorage.removeItem('user');
                                    window.location.href = '/';
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar__action-ghost" style={{ textAlign: 'center' }}>Log In</Link>
                            <Link to="/register" className="navbar__action-cta" style={{ textAlign: 'center' }}>Get Started →</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
