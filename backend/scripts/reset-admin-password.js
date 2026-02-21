/**
 * reset-admin-password.js
 * ─────────────────────────────────────────────────────────────
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from the .env file and
 * updates (or creates) the admin user in MongoDB.
 *
 * Run from backend directory:
 *   node scripts/reset-admin-password.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@indiaraksha.org';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in .env');
    process.exit(1);
}
if (!ADMIN_PASSWORD) {
    console.error('❌ ADMIN_PASSWORD is not set in .env');
    process.exit(1);
}

// Minimal user schema — enough to find and update
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, default: 'user' },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
}, { timestamps: true });

async function resetPassword() {
    console.log('\n🔐 IndiaRaksha — Admin Password Reset\n');
    console.log(`📧 Admin email   : ${ADMIN_EMAIL}`);
    console.log(`🔑 New password  : [from ADMIN_PASSWORD env var]\n`);

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.model('User', userSchema);

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Find admin by email and update password + ensure correct role/state
    const result = await User.findOneAndUpdate(
        { email: ADMIN_EMAIL },
        {
            password: hashed,
            role: 'admin',
            isActive: true,
            isEmailVerified: true,
            isMobileVerified: true,
        },
        { new: true, upsert: false, select: 'email role isActive' }
    );

    if (!result) {
        // Admin doesn't exist yet — create them
        console.log('⚠️  Admin user not found — creating...');
        await User.create({
            email: ADMIN_EMAIL,
            mobile: process.env.ADMIN_MOBILE || '+919999999999',
            name: 'Admin User',
            password: hashed,
            role: 'admin',
            isActive: true,
            isEmailVerified: true,
            isMobileVerified: true,
        });
        console.log('✅ Admin user created successfully!\n');
    } else {
        console.log(`✅ Password updated for: ${result.email}`);
        console.log(`   Role    : ${result.role}`);
        console.log(`   Active  : ${result.isActive}\n`);
    }

    console.log('🎉 Done! You can now log in with:');
    console.log(`   Email   : ${ADMIN_EMAIL}`);
    console.log(`   Password: [as set in ADMIN_PASSWORD env var]\n`);

    await mongoose.disconnect();
    process.exit(0);
}

resetPassword().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
