import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsSubmitting(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsSubmitting(false);
            return;
        }

        try {
            await authAPI.register({
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                password: formData.password,
            });
            // After successful registration, redirect to login
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12">
            <div className="max-w-md w-full mx-auto px-4">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center justify-center group">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:bg-blue-700 transition-colors">
                            <span className="text-4xl">🛡️</span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">Create Account</h1>
                    <p className="text-gray-600">Join IndiaRaksha to report and track scams</p>
                </div>

                {/* Register Form */}
                <div className="card bg-white shadow-lg">
                    {error && (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="input h-12"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="input h-12"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                                className="input h-12"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="input h-12"
                                required
                                minLength={6}
                            />
                            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="input h-12"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="flex items-start">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1"
                                    required
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    I agree to the{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                        Privacy Policy
                                    </a>
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-full text-lg py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold"
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
