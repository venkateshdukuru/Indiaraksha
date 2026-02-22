import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scamReportsAPI } from '@/lib/api';

const SCAM_TYPES = [
    { value: 'upi_scam', label: '💳 UPI Scam', description: 'Fake payment links, QR codes' },
    { value: 'whatsapp_fraud', label: '💬 WhatsApp Fraud', description: 'Impersonation, fake offers' },
    { value: 'fake_job', label: '💼 Fake Job Offer', description: 'Fraudulent job postings' },
    { value: 'phishing_website', label: '🌐 Phishing Site', description: 'Fake websites stealing data' },
    { value: 'loan_app_harassment', label: '💰 Loan App Scam', description: 'Illegal lending apps' },
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
    'Delhi', 'Puducherry', 'Jammu and Kashmir', 'Ladakh',
];

export default function Report() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        scamType: '', phoneNumber: '', url: '', appName: '',
        description: '', amountLost: '', city: '', state: '',
        isAnonymous: false, incidentDate: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true); setError('');
        try {
            const submitData: any = { scamType: formData.scamType, description: formData.description, isAnonymous: formData.isAnonymous };
            if (formData.phoneNumber) submitData.phoneNumber = formData.phoneNumber;
            if (formData.url) submitData.url = formData.url;
            if (formData.appName) submitData.appName = formData.appName;
            if (formData.amountLost) submitData.amountLost = parseFloat(formData.amountLost);
            if (formData.city) submitData.city = formData.city;
            if (formData.state) submitData.state = formData.state;
            if (formData.incidentDate) submitData.incidentDate = new Date(formData.incidentDate).toISOString();
            await scamReportsAPI.create(submitData);
            setSuccess(true);
            setTimeout(() => navigate('/'), 2500);
        } catch (err: any) {
            setError(err.message || 'Failed to submit report. Please try again.');
        } finally { setIsSubmitting(false); }
    };

    return (
        <>
            {/* ── Hero ── */}
            <section className="page-hero page-hero--red">
                <div className="page-hero__dots" />
                <div className="container-custom page-hero__inner">
                    <div className="page-hero__icon">🚨</div>
                    <h1 className="page-hero__title">Report a Scam</h1>
                    <p className="page-hero__sub">Help protect millions of Indians from digital fraud. Your report is powerful.</p>
                    <div className="page-hero__stats">
                        <div className="page-hero__stat"><span className="page-hero__stat-num">1000+</span><span className="page-hero__stat-label">Reports Filed</span></div>
                        <div className="page-hero__stat"><span className="page-hero__stat-num">₹50L+</span><span className="page-hero__stat-label">Money Saved</span></div>
                        <div className="page-hero__stat"><span className="page-hero__stat-num">100%</span><span className="page-hero__stat-label">Anonymous Option</span></div>
                    </div>
                </div>
            </section>

            {/* ── Form ── */}
            <div className="report-wrap">
                <div className="container-custom">
                    <div className="report-form-outer">

                        {success && (
                            <div className="form-alert form-alert--success animate-fade-in">
                                <span>✅</span>
                                <div>
                                    <strong>Report Submitted!</strong><br />
                                    Thank you for helping protect the community. Redirecting…
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="form-alert form-alert--error animate-fade-in">
                                <span>❌</span><div>{error}</div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="report-form">

                            {/* Scam Type */}
                            <div className="report-section">
                                <h2 className="report-section__title">1. Select Scam Type</h2>
                                <div className="form-group">
                                    <select
                                        name="scamType"
                                        value={formData.scamType}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    >
                                        <option value="">-- Choose Scam Category --</option>
                                        {SCAM_TYPES.map(t => (
                                            <option key={t.value} value={t.value}>
                                                {t.label}
                                            </option>
                                        ))}
                                    </select>

                                    {formData.scamType && (
                                        <div className="scam-type-feedback animate-fade-in">
                                            <strong>Info:</strong> {SCAM_TYPES.find(t => t.value === formData.scamType)?.description}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Scammer Details */}
                            <div className="report-section report-section--shaded">
                                <h2 className="report-section__title">2. Scammer Details</h2>
                                <p className="report-section__hint">Provide at least one identifier so we can warn others.</p>
                                <div className="report-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Phone Number</label>
                                        <input type="tel" name="phoneNumber" value={formData.phoneNumber}
                                            onChange={handleChange} placeholder="+91 98765 43210" className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Website URL (optional)</label>
                                        <input type="url" name="url" value={formData.url}
                                            onChange={handleChange} placeholder="https://suspicious-site.com" className="form-input" />
                                    </div>
                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="form-label">App Name / UPI ID</label>
                                        <input type="text" name="appName" value={formData.appName}
                                            onChange={handleChange} placeholder="e.g. QuickLoan App or scammer@upi" className="form-input" />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="report-section">
                                <h2 className="report-section__title">3. What Happened?</h2>
                                <p className="report-section__hint">Describe the incident — the more detail, the better we can warn others.</p>
                                <textarea name="description" value={formData.description} onChange={handleChange}
                                    rows={5} placeholder="I received a call claiming to be from…"
                                    className="form-input form-textarea" />
                            </div>

                            {/* Amount & Date */}
                            <div className="report-section report-section--shaded">
                                <h2 className="report-section__title">4. Amount &amp; Date</h2>
                                <div className="report-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Amount Lost (₹) — optional</label>
                                        <div style={{ position: 'relative' }}>
                                            <span className="input-prefix">₹</span>
                                            <input type="number" name="amountLost" value={formData.amountLost}
                                                onChange={handleChange} placeholder="0" min="0"
                                                className="form-input" style={{ paddingLeft: '2rem' }} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Incident Date — optional</label>
                                        <input type="date" name="incidentDate" value={formData.incidentDate}
                                            onChange={handleChange} max={new Date().toISOString().split('T')[0]}
                                            className="form-input" />
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="report-section">
                                <h2 className="report-section__title">5. Location — optional</h2>
                                <div className="report-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input type="text" name="city" value={formData.city}
                                            onChange={handleChange} placeholder="e.g. Mumbai" className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">State</label>
                                        <select name="state" value={formData.state} onChange={handleChange} className="form-input">
                                            <option value="">Select State</option>
                                            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Anonymous toggle */}
                            <div className="anon-toggle">
                                <label className="form-check">
                                    <input type="checkbox" name="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} />
                                    <span>
                                        <strong>Report Anonymously</strong>
                                        <span className="anon-toggle__note"> — Your name will not appear publicly</span>
                                    </span>
                                </label>
                            </div>

                            <button type="submit" disabled={isSubmitting} className="report-submit">
                                {isSubmitting ? '⏳ Submitting…' : '🚨 Submit Report'}
                            </button>
                            <p className="report-disclaimer">By submitting, you confirm the information is accurate to the best of your knowledge.</p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
