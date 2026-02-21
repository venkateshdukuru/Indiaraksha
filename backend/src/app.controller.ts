import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    @ApiOperation({ summary: 'Health check endpoint' })
    @ApiResponse({
        status: 200,
        description: 'API is healthy and running',
        schema: {
            example: {
                status: 'success',
                message: '🛡️ IndiaRaksha API is running',
                version: '1.0.0',
                timestamp: '2024-01-01T00:00:00.000Z',
            },
        },
    })
    getHealth() {
        return this.appService.getHealth();
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get platform statistics' })
    @ApiResponse({
        status: 200,
        description: 'Platform statistics',
        schema: {
            example: {
                totalReports: 1250,
                totalUsers: 5000,
                reportsToday: 45,
                activeAlerts: 3,
            },
        },
    })
    getStats() {
        return this.appService.getStats();
    }
}
