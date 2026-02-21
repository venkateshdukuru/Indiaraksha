import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Alert } from './schemas/alert.schema';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertsService {
    constructor(@InjectModel(Alert.name) private alertModel: Model<Alert>) { }

    async create(createAlertDto: CreateAlertDto, adminId: string) {
        const alert = await this.alertModel.create({
            ...createAlertDto,
            createdBy: new Types.ObjectId(adminId),
        });

        return {
            message: 'Alert created successfully',
            alert,
        };
    }

    async findAll(filters: any = {}, page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const query: any = { isActive: true };

        if (filters.city) {
            query.city = new RegExp(filters.city, 'i');
        }

        if (filters.state) {
            query.state = new RegExp(filters.state, 'i');
        }

        if (filters.alertType) {
            query.alertType = filters.alertType;
        }

        if (filters.severity) {
            query.severity = filters.severity;
        }

        const [alerts, total] = await Promise.all([
            this.alertModel
                .find(query)
                .populate('createdBy', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.alertModel.countDocuments(query),
        ]);

        return {
            alerts,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const alert = await this.alertModel
            .findById(id)
            .populate('createdBy', 'name email');

        if (!alert) {
            throw new NotFoundException('Alert not found');
        }

        return alert;
    }

    async getActiveAlerts(city?: string, state?: string) {
        const query: any = {
            isActive: true,
            $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gte: new Date() } }],
        };

        if (city) {
            query.city = new RegExp(city, 'i');
        }

        if (state) {
            query.state = new RegExp(state, 'i');
        }

        return this.alertModel
            .find(query)
            .populate('createdBy', 'name')
            .sort({ severity: -1, createdAt: -1 })
            .exec();
    }

    async deactivateAlert(id: string) {
        const alert = await this.alertModel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true },
        );

        if (!alert) {
            throw new NotFoundException('Alert not found');
        }

        return {
            message: 'Alert deactivated successfully',
            alert,
        };
    }

    async deleteExpiredAlerts() {
        const result = await this.alertModel.deleteMany({
            expiresAt: { $lt: new Date() },
        });

        return {
            message: `Deleted ${result.deletedCount} expired alerts`,
            deletedCount: result.deletedCount,
        };
    }
}
