import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scamReportsAPI } from '@/lib/api';

const SCAM_TYPES = [
    { value: 'upi_scam', label: '💳 UPI Scam', description: 'Fake payment links, QR codes' },
    { value: 'whatsapp_fraud', label: '💬 WhatsApp Fraud', description: 'Impersonation, fake offers' },
    { value: 'fake_job', label: '💼 Fake Job Offer', description: 'Fraudulent job postings' },
    { value: 'phishing_website', label: '🌐 Phishing Website', description: 'Fake websites stealing data' },
    { value: 'loan_app_harassment', label: '💰 Loan App Harassment', description: 'Illegal lending apps' },
    { value: 'sms_scam', label: '📱 SMS Scam', description: 'Fraudulent text messages' },
    { value: 'email_scam', label: '📧 Email Scam', description: 'Phishing emails' },
    { value: 'investment_fraud', label: '📈 Investment Fraud', description: 'Fake investment schemes' },
    { value: 'lottery_scam', label: '🎰 Lottery Scam', description: 'Fake lottery winnings' },
    { value: 'romance_scam', label: '❤️ Romance Scam', description: 'Dating/relationship fraud' },
    { value: 'other', label: '🔍 Other', description: 'Other types of scams' },
];

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Puducherry', 'Jammu and Kashmir', 'Ladakh'
];

export default function Report() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        scamType: '',
        phoneNumber: '',
        url: '',
        appName: '',
        description: '',
        amountLost: '',
        city: '',
        state: '',
        isAnonymous: false,
        incidentDate: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const submitData: any = {
                scamType: formData.scamType,
                description: formData.description,
                isAnonymous: formData.isAnonymous,
            };

            if (formData.phoneNumber) submitData.phoneNumber = formData.phoneNumber;
            if (formData.url) submitData.url = formData.url;
            if (formData.appName) submitData.appName = formData.appName;
            if (formData.amountLost) submitData.amountLost = parseFloat(formData.amountLost);
            if (formData.city) submitData.city = formData.city;
            if (formData.state) submitData.state = formData.state;
            if (formData.incidentDate) submitData.incidentDate = new Date(formData.incidentDate).toISOString();

            await scamReportsAPI.create(submitData);

            setSuccess(true);
            setFormData({
                scamType: '',
                phoneNumber: '',
                url: '',
                appName: '',
                description: '',
                amountLost: '',
                city: '',
                state: '',
                isAnonymous: false,
                incidentDate: '',
            });

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Failed to submit report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Enhanced Hero Section */}
            <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white py-20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="container-custom relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg">
                            <span className="text-5xl">🚨</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            Report a Scam
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-red-100 mb-8 leading-relaxed">
                            Help protect others by reporting fraudulent activities. Your report makes India safer.
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-8 text-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                                <div className="text-3xl font-bold">1000+</div>
                                <div className="text-red-100 text-sm">Reports Filed</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                                <div className="text-3xl font-bold">₹50L+</div>
                                <div className="text-red-100 text-sm">Money Saved</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                                <div className="text-3xl font-bold">100%</div>
                                <div className="text-red-100 text-sm">Anonymous</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Form Section */}
            <div className="container-custom py-16">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10 animate-fade-in">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Report a Scam</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Help protect others by reporting fraudulent numbers, websites, and apps.
                        </p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 p-6 rounded-xl mb-8 animate-fade-in flex items-center shadow-sm">
                            <span className="text-3xl mr-4">✅</span>
                            <div>
                                <h3 className="font-bold text-lg text-green-800">Report Submitted Successfully!</h3>
                                <p className="text-green-700">Thank you for helping protect the community. Redirecting...</p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 p-6 rounded-xl mb-8 animate-fade-in flex items-center shadow-sm">
                            <span className="text-3xl mr-4">❌</span>
                            <div>
                                <h3 className="font-bold text-lg text-red-800">Error</h3>
                                <p className="text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="card bg-white shadow-lg border-0 animate-fade-in">
                        {/* Scam Type */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Select Scam Type
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {SCAM_TYPES.map((type) => (
                                    <label
                                        key={type.value}
                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.scamType === type.value
                                            ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="scamType"
                                            value={type.value}
                                            checked={formData.scamType === type.value}
                                            onChange={handleChange}
                                            className="sr-only"

                                        />
                                        <div className="font-bold text-gray-900">{type.label}</div>
                                        <div className="text-sm text-gray-500">{type.description}</div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">i</span>
                                Scammer Details
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">Provide at least one identifier so we can warn others.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="+91 98765 43210"
                                        className="input bg-white h-12"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Website URL
                                    </label>
                                    <input
                                        type="url"
                                        name="url"
                                        value={formData.url}
                                        onChange={handleChange}
                                        placeholder="https://suspicious-site.com"
                                        className="input bg-white h-12"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-medium mb-2">
                                        App Name / UPI ID
                                    </label>
                                    <input
                                        type="text"
                                        name="appName"
                                        value={formData.appName}
                                        onChange={handleChange}
                                        placeholder="e.g. 'QuickLoan App' or 'scammer@upi'"
                                        className="input bg-white h-12"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <label className="block text-gray-900 font-bold text-lg mb-2">
                                Description
                            </label>
                            <p className="text-sm text-gray-500 mb-3">
                                Describe what happened. What did they say? How did they approach you?
                            </p>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                placeholder="I received a call claiming to be from..."
                                className="input text-base leading-relaxed"

                            />
                        </div>

                        {/* Amount Lost & Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Amount Lost (₹)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-gray-500">₹</span>
                                    <input
                                        type="number"
                                        name="amountLost"
                                        value={formData.amountLost}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        className="input pl-8 h-12"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Incident Date
                                </label>
                                <input
                                    type="date"
                                    name="incidentDate"
                                    value={formData.incidentDate}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="input h-12"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="mb-8 border-t border-gray-100 pt-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Location (Optional)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="e.g. Mumbai"
                                        className="input h-12"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">State</label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="input h-12 bg-white"
                                    >
                                        <option value="">Select State</option>
                                        {INDIAN_STATES.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Anonymous Reporting */}
                        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isAnonymous"
                                    checked={formData.isAnonymous}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-900 font-medium">
                                    Report Anonymously <span className="text-gray-500 font-normal">- Hide my name from public view</span>
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-danger w-full text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold"
                        >
                            {isSubmitting ? 'Submitting Report...' : '🚨 Submit Report'}
                        </button>

                        <p className="text-sm text-gray-500 text-center mt-6">
                            By submitting this report, you confirm the information is true to the best of your knowledge.
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
