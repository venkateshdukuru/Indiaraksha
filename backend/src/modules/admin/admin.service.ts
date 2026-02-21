import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { ScamReport, ReportStatus } from '../scam-reports/schemas/scam-report.schema';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(ScamReport.name) private scamReportModel: Model<ScamReport>,
    ) { }

    async getDashboardStats() {
        const [
            totalUsers,
            totalReports,
            pendingReports,
            verifiedReports,
            rejectedReports,
            reportsToday,
            usersToday,
        ] = await Promise.all([
            this.userModel.countDocuments(),
            this.scamReportModel.countDocuments(),
            this.scamReportModel.countDocuments({ status: ReportStatus.PENDING }),
            this.scamReportModel.countDocuments({ status: ReportStatus.VERIFIED }),
            this.scamReportModel.countDocuments({ status: ReportStatus.REJECTED }),
            this.scamReportModel.countDocuments({
                createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            }),
            this.userModel.countDocuments({
                createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            }),
        ]);

        return {
            users: {
                total: totalUsers,
                today: usersToday,
            },
            reports: {
                total: totalReports,
                pending: pendingReports,
                verified: verifiedReports,
                rejected: rejectedReports,
                today: reportsToday,
            },
        };
    }

    async getReportsByLocation() {
        return this.scamReportModel.aggregate([
            {
                $match: {
                    state: { $exists: true, $ne: null },
                },
            },
            {
                $group: {
                    _id: { state: '$state', city: '$city' },
                    count: { $sum: 1 },
                    totalLoss: { $sum: '$amountLost' },
                },
            },
            {
                $sort: { count: -1 },
            },
            {
                $limit: 50,
            },
        ]);
    }

    async getScamTrends(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        return this.scamReportModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        scamType: '$scamType',
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { '_id.date': 1 },
            },
        ]);
    }

    async getPendingReports(page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [reports, total] = await Promise.all([
            this.scamReportModel
                .find({ status: ReportStatus.PENDING })
                .populate('reportedBy', 'name email city state')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.scamReportModel.countDocuments({ status: ReportStatus.PENDING }),
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

    async getAllUsers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            this.userModel
                .find()
                .select('-password -refreshTokens')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.userModel.countDocuments(),
        ]);

        return {
            users,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }
}
