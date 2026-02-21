import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ScamReportsModule } from './modules/scam-reports/scam-reports.module';
import { ScamEntitiesModule } from './modules/scam-entities/scam-entities.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { AdminModule } from './modules/admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // MongoDB Atlas
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
                retryWrites: true,
                w: 'majority',
            }),
            inject: [ConfigService],
        }),

        // Rate Limiting
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => [
                {
                    ttl: configService.get('RATE_LIMIT_TTL') || 60000,
                    limit: configService.get('RATE_LIMIT_MAX') || 100,
                },
            ],
            inject: [ConfigService],
        }),

        // Feature Modules
        AuthModule,
        UsersModule,
        ScamReportsModule,
        ScamEntitiesModule,
        AlertsModule,
        AdminModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
