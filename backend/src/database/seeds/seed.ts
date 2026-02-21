import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Model } from 'mongoose';
import { User, UserRole } from '../../modules/users/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

async function seed() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const userModel = app.get<Model<User>>(getModelToken(User.name));

    console.log('🌱 Starting database seeding...\n');

    // Create admin user
    const adminExists = await userModel.findOne({
        email: 'admin@indiaraksha.org',
    });

    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        await userModel.create({
            email: 'admin@indiaraksha.org',
            mobile: '+919999999999',
            name: 'Admin User',
            password: hashedPassword,
            role: UserRole.ADMIN,
            isActive: true,
            isEmailVerified: true,
            isMobileVerified: true,
            city: 'Mumbai',
            state: 'Maharashtra',
        });
        console.log('✅ Admin user created');
        console.log('   Email: admin@indiaraksha.org');
        console.log('   Password: Admin@123');
        console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!\n');
    } else {
        console.log('ℹ️  Admin user already exists\n');
    }

    // Create sample users
    const sampleUsers = [
        {
            email: 'user1@example.com',
            mobile: '+919876543210',
            name: 'Rajesh Kumar',
            password: await bcrypt.hash('User@123', 10),
            role: UserRole.USER,
            city: 'Delhi',
            state: 'Delhi',
        },
        {
            email: 'user2@example.com',
            mobile: '+919876543211',
            name: 'Priya Sharma',
            password: await bcrypt.hash('User@123', 10),
            role: UserRole.USER,
            city: 'Bangalore',
            state: 'Karnataka',
        },
    ];

    for (const userData of sampleUsers) {
        const exists = await userModel.findOne({ email: userData.email });
        if (!exists) {
            await userModel.create(userData);
            console.log(`✅ Created user: ${userData.name}`);
        }
    }

    console.log('\n🎉 Database seeding completed!\n');
    console.log('📝 Next steps:');
    console.log('   1. Start the server: npm run start:dev');
    console.log('   2. Visit API docs: http://localhost:3000/api/docs');
    console.log('   3. Login with admin credentials to start moderating\n');

    await app.close();
}

seed()
    .then(() => {
        console.log('✨ Seed script finished successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Seed script failed:', error);
        process.exit(1);
    });
