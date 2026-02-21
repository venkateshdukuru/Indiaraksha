import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    const configService = app.get(ConfigService);

    // Security
    app.use(helmet());
    app.use(compression());

    // CORS
    app.enableCors({
        origin: configService.get('CORS_ORIGIN')?.split(',') || '*',
        credentials: true,
    });

    // Global prefix
    app.setGlobalPrefix('api/v1');

    // Validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Swagger Documentation
    const config = new DocumentBuilder()
        .setTitle('IndiaRaksha API')
        .setDescription(
            '🛡️ IndiaRaksha - A Secure Scam & Fraud Reporting Platform for the Public\n\n' +
            'This platform helps citizens report scams, check suspicious numbers/links, and receive real-time fraud alerts.\n\n' +
            '**Mission:** Protect families, students, job seekers, and elders from digital fraud.',
        )
        .setVersion('1.0')
        .addTag('Authentication', 'User registration, login, and token management')
        .addTag('Scam Reports', 'Report and manage scam incidents')
        .addTag('Scam Lookup', 'Search and check suspicious numbers/URLs')
        .addTag('Alerts', 'Real-time fraud alerts and notifications')
        .addTag('Admin', 'Administrative and moderation operations')
        .addTag('Users', 'User profile and account management')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'IndiaRaksha API Documentation',
        customfavIcon: 'https://indiaraksha.org/favicon.ico',
        customCss: '.swagger-ui .topbar { display: none }',
    });

    const port = configService.get('PORT') || 3000;
    await app.listen(port);

    console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   🛡️  IndiaRaksha - Digital Protection Platform          ║
  ║                                                           ║
  ║   🚀 Server running on: http://localhost:${port}         ║
  ║   📚 API Docs: http://localhost:${port}/api/docs         ║
  ║                                                           ║
  ║   Mission: Protect citizens from digital fraud           ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
