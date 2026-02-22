import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true); setError('');
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); setIsSubmitting(false); return; }
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); setIsSubmitting(false); return; }
        try {
            await authAPI.register({ name: formData.name, email: formData.email, mobile: formData.mobile, password: formData.password });
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally { setIsSubmitting(false); }
    };

    return (
        <div className="auth-page">
            {/* Left panel */}
            <div className="auth-panel auth-panel--left">
                <img src="/logo.svg" alt="IndiaRaksha" className="auth-panel__logo" width="64" height="64" />
                <h2 className="auth-panel__title">Join IndiaRaksha</h2>
                <p className="auth-panel__sub">Be part of India's largest community fighting digital fraud</p>
                <ul className="auth-panel__perks">
                    <li>🚨 Report scams to protect others</li>
                    <li>📊 Track your reported cases</li>
                    <li>🔔 Get personalised alerts</li>
                    <li>🏆 Earn community trust points</li>
                </ul>
            </div>

            {/* Right panel – form */}
            <div className="auth-panel auth-panel--right">
                <div className="auth-form-wrap">
                    <div className="auth-form__header">
                        <h1 className="auth-form__title">Create Account</h1>
                        <p className="auth-form__sub">It's free — always will be</p>
                    </div>

                    {error && <div className="form-alert form-alert--error">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                placeholder="Ravi Kumar" className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange}
                                placeholder="you@example.com" className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Mobile Number</label>
                            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange}
                                placeholder="+91 9000000000" className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange}
                                placeholder="Min. 6 characters" className="form-input" required minLength={6} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                placeholder="••••••••" className="form-input" required minLength={6} />
                        </div>

                        <label className="form-check" style={{ marginBottom: '1rem' }}>
                            <input type="checkbox" required />
                            <span>I agree to the <a href="#" className="form-link">Terms</a> and <a href="#" className="form-link">Privacy Policy</a></span>
                        </label>

                        <button type="submit" disabled={isSubmitting} className="form-submit">
                            {isSubmitting ? '⏳ Creating Account…' : 'Create Account →'}
                        </button>
                    </form>

                    <p className="auth-form__switch">
                        Already have an account? <Link to="/login" className="form-link">Sign in</Link>
                    </p>
                    <Link to="/" className="auth-form__back">← Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
