import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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

        try {
            await authAPI.login(formData.email, formData.password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
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
                    <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your IndiaRaksha account</p>
                </div>

                {/* Login Form */}
                <div className="card bg-white shadow-lg">
                    {error && (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
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
                            />
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-full text-lg py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold"
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                                Sign up
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
