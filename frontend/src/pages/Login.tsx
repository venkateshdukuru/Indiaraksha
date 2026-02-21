import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true); setError('');
        try {
            const result = await authAPI.login(formData.email, formData.password);
            // Redirect based on role
            const role = result?.user?.role;
            if (role === 'admin' || role === 'moderator') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally { setIsSubmitting(false); }
    };

    return (
        <div className="auth-page">
            {/* Left panel */}
            <div className="auth-panel auth-panel--left">
                <img src="/logo.svg" alt="IndiaRaksha" className="auth-panel__logo" width="64" height="64" />
                <h2 className="auth-panel__title">IndiaRaksha</h2>
                <p className="auth-panel__sub">Protecting citizens from digital fraud since 2024</p>
                <ul className="auth-panel__perks">
                    <li>✅ Free & anonymous reporting</li>
                    <li>✅ Instant scam lookup database</li>
                    <li>✅ Real-time fraud alerts</li>
                    <li>✅ Verified by the community</li>
                </ul>
            </div>

            {/* Right panel – form */}
            <div className="auth-panel auth-panel--right">
                <div className="auth-form-wrap">
                    <div className="auth-form__header">
                        <h1 className="auth-form__title">Welcome back</h1>
                        <p className="auth-form__sub">Sign in to your IndiaRaksha account</p>
                    </div>

                    {error && <div className="form-alert form-alert--error">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange}
                                placeholder="you@example.com" className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange}
                                placeholder="••••••••" className="form-input" required />
                        </div>

                        <div className="form-row">
                            <label className="form-check">
                                <input type="checkbox" /> <span>Remember me</span>
                            </label>
                            <a href="#" className="form-link">Forgot password?</a>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="form-submit">
                            {isSubmitting ? '⏳ Signing in…' : 'Sign In →'}
                        </button>
                    </form>

                    <p className="auth-form__switch">
                        Don't have an account? <Link to="/register" className="form-link">Sign up free</Link>
                    </p>
                    <Link to="/" className="auth-form__back">← Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
