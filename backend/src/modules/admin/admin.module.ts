import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ScamReportsModule } from '../scam-reports/scam-reports.module';
import { ScamEntitiesModule } from '../scam-entities/scam-entities.module';
import { AlertsModule } from '../alerts/alerts.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { ScamReport, ScamReportSchema } from '../scam-reports/schemas/scam-report.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: ScamReport.name, schema: ScamReportSchema },
        ]),
        ScamReportsModule,
        ScamEntitiesModule,
        AlertsModule,
    ],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
