import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__inner">
                <div className="footer__grid">
                    {/* Brand Section */}
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            <img src="/logo.svg" alt="IndiaRaksha" className="footer__logo-img" />
                            <span className="footer__logo-text">IndiaRaksha</span>
                        </Link>
                        <p className="footer__tagline">
                            India's first community-driven platform to report, verify, and check fraudulent numbers, websites, and apps. Together we protect each other.
                        </p>
                        <div className="footer__india">
                            <span>🇮🇳</span> Protecting India from Digital Fraud
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer__column">
                        <h3 className="footer__column-title">Quick Links</h3>
                        <ul className="footer__list">
                            <li><Link to="/report" className="footer__link">Report Scam</Link></li>
                            <li><Link to="/lookup" className="footer__link">Check Number</Link></li>
                            <li><Link to="/alerts" className="footer__link">Fraud Alerts</Link></li>
                            <li><a href="https://github.com/venkateshdukuru/Indiaraksha" target="_blank" rel="noopener noreferrer" className="footer__link">Developers / Contribute</a></li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div className="footer__column">
                        <h3 className="footer__column-title">Account</h3>
                        <ul className="footer__list">
                            <li><Link to="/login" className="footer__link">Login</Link></li>
                            <li><Link to="/register" className="footer__link">Register</Link></li>
                            <li><Link to="/profile" className="footer__link">My Profile</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer__bottom">
                    <div className="footer__bottom-left">
                        <p className="footer__copy">
                            &copy; {new Date().getFullYear()} IndiaRaksha. Secure Bharat, Shared Responsibility.
                        </p>
                        <p className="footer__credit">
                            make love with <span className="footer__credit-name">dukuru venkatesh</span>
                        </p>
                    </div>
                    <div className="footer__legal">
                        <Link to="/privacy" className="footer__legal-link">Privacy Policy</Link>
                        <Link to="/terms" className="footer__legal-link">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
