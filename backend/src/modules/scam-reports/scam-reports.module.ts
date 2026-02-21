import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScamReportsController } from './scam-reports.controller';
import { ScamReportsService } from './scam-reports.service';
import { ScamReport, ScamReportSchema } from './schemas/scam-report.schema';
import { ScamEntitiesModule } from '../scam-entities/scam-entities.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ScamReport.name, schema: ScamReportSchema },
        ]),
        ScamEntitiesModule,
    ],
    controllers: [ScamReportsController],
    providers: [ScamReportsService],
    exports: [ScamReportsService],
})
export class ScamReportsModule { }
