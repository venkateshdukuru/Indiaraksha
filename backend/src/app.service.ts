import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHealth() {
        return {
            status: 'success',
            message: '🛡️ IndiaRaksha API is running',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            mission: 'Protecting citizens from digital fraud',
        };
    }

    getStats() {
        // This will be populated with real data from database
        return {
            totalReports: 0,
            totalUsers: 0,
            reportsToday: 0,
            activeAlerts: 0,
            message: 'Platform statistics will be available once data is populated',
        };
    }
}
