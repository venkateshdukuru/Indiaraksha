import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ScamReport, ReportStatus } from './schemas/scam-report.schema';
import { CreateScamReportDto } from './dto/create-scam-report.dto';
import { ScamEntitiesService } from '../scam-entities/scam-entities.service';

@Injectable()
export class ScamReportsService {
    constructor(
        @InjectModel(ScamReport.name) private scamReportModel: Model<ScamReport>,
        private scamEntitiesService: ScamEntitiesService,
    ) { }

    async create(
        createScamReportDto: CreateScamReportDto,
        userId: string,
        ip?: string,
    ) {
        const {
            scamType,
            phoneNumber,
            url,
            appName,
            description,
            amountLost,
            city,
            state,
            isAnonymous,
            incidentDate,
        } = createScamReportDto;

        // Validate that at least one identifier is provided
        if (!phoneNumber && !url && !appName) {
            throw new BadRequestException(
                'Please provide at least one: phone number, URL, or app name',
            );
        }

        // Create the report
        const report = await this.scamReportModel.create({
            reportedBy: new Types.ObjectId(userId),
            scamType,
            phoneNumber,
            url,
            appName,
            description,
            amountLost,
            city,
            state,
            isAnonymous: isAnonymous || false,
            incidentDate,
            reporterIp: ip,
        });

        // Update scam entities (reputation system)
        if (phoneNumber) {
            await this.scamEntitiesService.updateOrCreate(
                'phone_number',
                phoneNumber,
                scamType,
                amountLost,
            );
        }

        if (url) {
            await this.scamEntitiesService.updateOrCreate(
                'url',
                url,
                scamType,
                amountLost,
            );
        }

        if (appName) {
            await this.scamEntitiesService.updateOrCreate(
                'app',
                appName,
                scamType,
                amountLost,
            );
        }

        return {
            message: 'Thank you for reporting! Your report helps protect others.',
            report: await report.populate('reportedBy', 'name email'),
        };
    }

    async findAll(filters: any = {}, page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const query: any = {};

        if (filters.scamType) {
            query.scamType = filters.scamType;
        }

        if (filters.status) {
            query.status = filters.status;
        }

        if (filters.city) {
            query.city = new RegExp(filters.city, 'i');
        }

        if (filters.state) {
            query.state = new RegExp(filters.state, 'i');
        }

        if (filters.userId) {
            query.reportedBy = new Types.ObjectId(filters.userId);
        }

        const [reports, total] = await Promise.all([
            this.scamReportModel
                .find(query)
                .populate('reportedBy', 'name city state')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.scamReportModel.countDocuments(query),
        ]);

        return {
            reports,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid report ID');
        }

        const report = await this.scamReportModel
            .findById(id)
            .populate('reportedBy', 'name email city state')
            .populate('verifiedBy', 'name email');

        if (!report) {
            throw new NotFoundException('Report not found');
        }

        return report;
    }

    async getMyReports(userId: string, page = 1, limit = 20) {
        return this.findAll({ userId }, page, limit);
    }

    async getStatistics() {
        const [
            totalReports,
            verifiedReports,
            pendingReports,
            scamTypeStats,
            recentReports,
        ] = await Promise.all([
            this.scamReportModel.countDocuments(),
            this.scamReportModel.countDocuments({ status: ReportStatus.VERIFIED }),
            this.scamReportModel.countDocuments({ status: ReportStatus.PENDING }),
            this.scamReportModel.aggregate([
                {
                    $group: {
                        _id: '$scamType',
                        count: { $sum: 1 },
                        totalLoss: { $sum: '$amountLost' },
                    },
                },
                { $sort: { count: -1 } },
            ]),
            this.scamReportModel
                .find()
                .sort({ createdAt: -1 })
                .limit(10)
                .populate('reportedBy', 'name city state'),
        ]);

        return {
            totalReports,
            verifiedReports,
            pendingReports,
            scamTypeStats,
            recentReports,
        };
    }

    async getTrendingScams(limit = 10) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const trending = await this.scamReportModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                    status: ReportStatus.VERIFIED,
                },
            },
            {
                $group: {
                    _id: '$scamType',
                    count: { $sum: 1 },
                    totalLoss: { $sum: '$amountLost' },
                },
            },
            { $sort: { count: -1 } },
            { $limit: limit },
        ]);

        return trending;
    }

    // Admin methods
    async verifyReport(reportId: string, adminId: string) {
        const report = await this.findOne(reportId);

        report.status = ReportStatus.VERIFIED;
        report.verifiedBy = new Types.ObjectId(adminId);
        report.verifiedAt = new Date();

        await report.save();

        return {
            message: 'Report verified successfully',
            report,
        };
    }

    async rejectReport(reportId: string, adminId: string, reason: string) {
        const report = await this.findOne(reportId);

        report.status = ReportStatus.REJECTED;
        report.verifiedBy = new Types.ObjectId(adminId);
        report.verifiedAt = new Date();
        report.rejectionReason = reason;

        await report.save();

        return {
            message: 'Report rejected',
            report,
        };
    }
}
