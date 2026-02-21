/**
 * Seed script: creates sample fraud alerts in MongoDB for IndiaRaksha.
 * Run from the backend folder:
 *   node scripts/seed-alerts.js
 * Requires a .env file with MONGODB_URI set.
 */

require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not set in .env');
    process.exit(1);
}

// We need a valid user ObjectId to set as createdBy.
// This script will look for the admin user, or create a placeholder.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@indiaraksha.org';

const SAMPLE_ALERTS = [
    {
        title: '🚨 Mass UPI Scam — Fake Payment Links Spreading via WhatsApp',
        message:
            'Multiple reports of fraudulent UPI payment links being shared through WhatsApp groups, claiming to offer cashback from popular apps like PhonePe and Google Pay. Do NOT click any link asking you to "receive" money — legitimate transfers never require the receiver to enter a PIN.',
        alertType: 'critical_threat',
        severity: 'critical',
        state: 'Maharashtra',
        city: 'Mumbai',
        relatedScamTypes: ['upi_scam', 'whatsapp_fraud'],
        isActive: true,
    },
    {
        title: '⚠️ Fake Job Offers Targeting Engineering Freshers',
        message:
            'Scammers are posing as HR managers from top IT companies (TCS, Infosys, Wipro) and offering jobs via email and LinkedIn. They ask for a "registration fee" or "background check fee" before joining. Legitimate companies NEVER charge fees during the hiring process.',
        alertType: 'new_scam_pattern',
        severity: 'warning',
        state: 'Karnataka',
        city: 'Bengaluru',
        relatedScamTypes: ['fake_job'],
        isActive: true,
    },
    {
        title: '📱 Fraudulent Loan Apps — Delete Immediately',
        message:
            'Several illegal loan apps have been detected on third-party app stores promising instant loans with no KYC. After the loan is disbursed, they charge excessive interest and threaten borrowers by accessing their contacts. Report these apps to cybercrime.gov.in.',
        alertType: 'trending_scam',
        severity: 'critical',
        state: 'Delhi',
        relatedScamTypes: ['loan_app_harassment'],
        isActive: true,
    },
    {
        title: '🌐 Phishing Sites Mimicking SBI & HDFC Net Banking',
        message:
            'A surge of convincing phishing websites that look identical to SBI and HDFC internet banking portals has been detected. Always verify the URL (should be https://www.onlinesbi.sbi or https://netbanking.hdfcbank.com). Bookmark the real sites and never access banking via links in SMS or email.',
        alertType: 'area_alert',
        severity: 'critical',
        state: 'Tamil Nadu',
        city: 'Chennai',
        relatedScamTypes: ['phishing_website'],
        isActive: true,
    },
    {
        title: '📧 KYC Update Scam via SMS & Calls',
        message:
            'Fraudsters are calling citizens claiming to be bank employees and asking them to "update KYC" by sharing OTPs or installing remote access apps like AnyDesk or TeamViewer. Your bank will NEVER ask for your OTP, PIN, or CVV over phone or SMS.',
        alertType: 'trending_scam',
        severity: 'warning',
        relatedScamTypes: ['sms_scam', 'email_scam'],
        isActive: true,
    },
    {
        title: '📈 Fake Stock Tips — Investment Fraud via Telegram',
        message:
            'Large Telegram groups are offering "guaranteed" stock market tips and asking users to invest money through unauthorised portals. SEBI-registered advisors never charge upfront money through UPI or crypto. Always verify registrations on sebi.gov.in before investing.',
        alertType: 'new_scam_pattern',
        severity: 'warning',
        state: 'Gujarat',
        city: 'Ahmedabad',
        relatedScamTypes: ['investment_fraud'],
        isActive: true,
    },
];

async function seed() {
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db();
        const usersCol = db.collection('users');
        const alertsCol = db.collection('alerts');

        // Find the admin user to use as createdBy
        let adminUser = await usersCol.findOne({ email: ADMIN_EMAIL });
        let adminId;

        if (adminUser) {
            adminId = adminUser._id;
            console.log(`👤 Using admin user: ${adminUser.email}`);
        } else {
            // No admin yet — use a placeholder ObjectId
            adminId = new ObjectId();
            console.log(`⚠️  Admin user not found. Using placeholder ID: ${adminId}`);
        }

        // Delete existing sample alerts to avoid duplicates
        const deleted = await alertsCol.deleteMany({ title: { $in: SAMPLE_ALERTS.map(a => a.title) } });
        if (deleted.deletedCount > 0) {
            console.log(`🗑️  Removed ${deleted.deletedCount} existing sample alerts`);
        }

        const now = new Date();
        const toInsert = SAMPLE_ALERTS.map(alert => ({
            ...alert,
            createdBy: adminId,
            createdAt: now,
            updatedAt: now,
        }));

        const result = await alertsCol.insertMany(toInsert);
        console.log(`✅ Inserted ${result.insertedCount} sample alerts successfully!`);
        console.log('🎉 Alerts page should now show data.');
    } catch (err) {
        console.error('❌ Error seeding alerts:', err.message);
        process.exit(1);
    } finally {
        await client.close();
    }
}

seed();
