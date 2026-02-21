import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI, scamReportsAPI } from '@/lib/api';

export default function Profile() {
    const [profile, setProfile] = useState<any>(null);
    const [myReports, setMyReports] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        city: '',
        state: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileData, reportsData] = await Promise.all([
                usersAPI.getProfile(),
                scamReportsAPI.getMyReports(),
            ]);
            setProfile(profileData);
            setMyReports(reportsData);
            setFormData({
                name: profileData.name || '',
                mobile: profileData.mobile || '',
                city: profileData.city || '',
                state: profileData.state || '',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await usersAPI.updateProfile(formData);
            setIsEditing(false);
            fetchData();
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (loading) {
        return (
            <div className="container-custom py-12">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <>
            <div className="container-custom py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
                        <p className="text-gray-600">Manage your account and view your reports</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="card bg-white shadow-lg">
                                <div className="text-center mb-6">
                                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-4xl">👤</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
                                    <p className="text-gray-500">{profile?.email}</p>
                                </div>

                                {!isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-sm text-gray-500">Mobile</div>
                                            <div className="font-medium text-gray-900">{profile?.mobile || 'Not set'}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Location</div>
                                            <div className="font-medium text-gray-900">
                                                {profile?.city && profile?.state
                                                    ? `${profile.city}, ${profile.state}`
                                                    : 'Not set'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Member Since</div>
                                            <div className="font-medium text-gray-900">
                                                {new Date(profile?.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="btn btn-primary w-full"
                                        >
                                            Edit Profile
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="input"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="submit" className="btn btn-primary flex-1">
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 flex-1"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* My Reports */}
                        <div className="lg:col-span-2">
                            <div className="card bg-white shadow-lg">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">My Reports</h3>

                                {myReports.length > 0 ? (
                                    <div className="space-y-4">
                                        {myReports.map((report) => (
                                            <div key={report._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                                                            {report.scamType.replace(/_/g, ' ').toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className={`px-2 py-1 text-xs font-bold rounded ${report.status === 'verified' ? 'bg-green-100 text-green-800' :
                                                            report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {report.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 mb-2 line-clamp-2">{report.description}</p>
                                                <div className="flex gap-4 text-sm text-gray-500">
                                                    <span>📅 {new Date(report.createdAt).toLocaleDateString()}</span>
                                                    {report.amountLost && <span>💰 ₹{report.amountLost.toLocaleString()}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">📝</div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Reports Yet</h3>
                                        <p className="text-gray-600 mb-6">You haven't submitted any scam reports.</p>
                                        <Link to="/report" className="btn btn-primary">
                                            Report a Scam
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
