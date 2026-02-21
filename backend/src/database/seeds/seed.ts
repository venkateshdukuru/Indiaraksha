import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Model } from 'mongoose';
import { User, UserRole } from '../../modules/users/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

/**
 * All credentials come exclusively from environment variables.
 * Never hardcode passwords in source code.
 *
 * Required env vars:
 *   ADMIN_EMAIL     – admin account email
 *   ADMIN_PASSWORD  – admin account password
 *   ADMIN_MOBILE    – admin mobile number
 *
 * Optional env vars for sample users (dev only):
 *   SEED_USER1_EMAIL    / SEED_USER1_PASSWORD / SEED_USER1_MOBILE
 *   SEED_USER2_EMAIL    / SEED_USER2_PASSWORD / SEED_USER2_MOBILE
 */

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(
            `❌  Environment variable "${name}" is not set.\n` +
            `    Set it in your .env file before running the seed script.`
        );
    }
    return value;
}

async function seed() {
    // ── Validate required env vars up-front ──────────────────────────
    const adminEmail = requireEnv('ADMIN_EMAIL');
    const adminPassword = requireEnv('ADMIN_PASSWORD');
    const adminMobile = requireEnv('ADMIN_MOBILE');

    const app = await NestFactory.createApplicationContext(AppModule);
    const userModel = app.get<Model<User>>(getModelToken(User.name));

    console.log('🌱 Starting database seeding…\n');
    console.log(`📧 Admin email  : ${adminEmail}`);
    console.log(`📱 Admin mobile : ${adminMobile}`);
    console.log(`🔑 Admin password: [read from ADMIN_PASSWORD env var]\n`);

    // ── Admin user ────────────────────────────────────────────────────
    const adminExists = await userModel.findOne({ email: adminEmail });

    if (!adminExists) {
        const hashed = await bcrypt.hash(adminPassword, 10);
        await userModel.create({
            email: adminEmail,
            mobile: adminMobile,
            name: 'Admin User',
            password: hashed,
            role: UserRole.ADMIN,
            isActive: true,
            isEmailVerified: true,
            isMobileVerified: true,
            city: 'Mumbai',
            state: 'Maharashtra',
        });
        console.log('✅ Admin user created');
        console.log(`   Email  : ${adminEmail}`);
        console.log('   Password: [as set in ADMIN_PASSWORD]\n');
    } else {
        // Always sync password from env so env is the single source of truth
        const hashed = await bcrypt.hash(adminPassword, 10);
        await userModel.findByIdAndUpdate(adminExists._id, {
            password: hashed,
            role: UserRole.ADMIN,
            isActive: true,
            isEmailVerified: true,
            isMobileVerified: true,
        });
        console.log('🔄 Admin already exists — password synced from env.\n');
    }

    // ── Sample users (dev / staging only) ────────────────────────────
    // Passwords come from env; if not set the sample users are skipped.
    const sampleDefs = [
        {
            email: process.env.SEED_USER1_EMAIL,
            password: process.env.SEED_USER1_PASSWORD,
            mobile: process.env.SEED_USER1_MOBILE,
            name: 'Rajesh Kumar',
            city: 'Delhi',
            state: 'Delhi',
        },
        {
            email: process.env.SEED_USER2_EMAIL,
            password: process.env.SEED_USER2_PASSWORD,
            mobile: process.env.SEED_USER2_MOBILE,
            name: 'Priya Sharma',
            city: 'Bangalore',
            state: 'Karnataka',
        },
    ];

    for (const def of sampleDefs) {
        // Skip if any required field is missing
        if (!def.email || !def.password || !def.mobile) continue;

        const exists = await userModel.findOne({ email: def.email });
        if (!exists) {
            const hashed = await bcrypt.hash(def.password, 10);
            await userModel.create({
                email: def.email,
                mobile: def.mobile,
                name: def.name,
                password: hashed,
                role: UserRole.USER,
                city: def.city,
                state: def.state,
            });
            console.log(`✅ Created sample user: ${def.name} (${def.email})`);
        } else {
            console.log(`ℹ️  Sample user already exists: ${def.email}`);
        }
    }

    console.log('\n🎉 Database seeding completed!\n');
    console.log('📝 Next steps:');
    console.log('   1. Start the server : npm run start:dev');
    console.log('   2. API docs         : http://localhost:3000/api/docs');
    console.log(`   3. Login as admin   : ${adminEmail}\n`);

    await app.close();
}

seed()
    .then(() => {
        console.log('✨ Seed script finished successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Seed script failed:', error.message);
        process.exit(1);
    });
