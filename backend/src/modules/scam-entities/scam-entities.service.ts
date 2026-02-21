import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScamEntity, EntityType, RiskLevel } from './schemas/scam-entity.schema';

@Injectable()
export class ScamEntitiesService {
    constructor(
        @InjectModel(ScamEntity.name) private scamEntityModel: Model<ScamEntity>,
    ) { }

    async updateOrCreate(
        entityType: string,
        entityValue: string,
        scamType: string,
        amountLost?: number,
    ) {
        let entity = await this.scamEntityModel.findOne({ entityValue });

        if (!entity) {
            // Create new entity
            entity = await this.scamEntityModel.create({
                entityType,
                entityValue,
                reportCount: 1,
                scamCategories: [scamType],
                totalAmountLost: amountLost || 0,
                firstReportedAt: new Date(),
                lastReportedAt: new Date(),
            });
        } else {
            // Update existing entity
            entity.reportCount += 1;
            entity.totalAmountLost += amountLost || 0;
            entity.lastReportedAt = new Date();

            if (!entity.scamCategories.includes(scamType)) {
                entity.scamCategories.push(scamType);
            }
        }

        // Calculate reputation score and risk level
        entity.reputationScore = this.calculateReputationScore(entity);
        entity.riskLevel = this.calculateRiskLevel(entity);

        await entity.save();
        return entity;
    }

    async lookup(entityValue: string) {
        const entity = await this.scamEntityModel.findOne({ entityValue });

        if (!entity) {
            return {
                found: false,
                message: '✅ No reports found for this number/URL. Stay vigilant!',
                entityValue,
            };
        }

        return {
            found: true,
            message: this.getWarningMessage(entity),
            entity,
        };
    }

    async search(query: string, entityType?: EntityType, page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const filter: any = {
            entityValue: new RegExp(query, 'i'),
        };

        if (entityType) {
            filter.entityType = entityType;
        }

        const [entities, total] = await Promise.all([
            this.scamEntityModel
                .find(filter)
                .sort({ reportCount: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.scamEntityModel.countDocuments(filter),
        ]);

        return {
            entities,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async getTopScammers(limit = 50) {
        return this.scamEntityModel
            .find()
            .sort({ reportCount: -1 })
            .limit(limit)
            .exec();
    }

    async getHighRiskEntities(limit = 50) {
        return this.scamEntityModel
            .find({ riskLevel: RiskLevel.CRITICAL })
            .sort({ reportCount: -1 })
            .limit(limit)
            .exec();
    }

    async blockEntity(entityValue: string) {
        const entity = await this.scamEntityModel.findOne({ entityValue });

        if (!entity) {
            throw new NotFoundException('Entity not found');
        }

        entity.isBlocked = true;
        await entity.save();

        return {
            message: 'Entity blocked successfully',
            entity,
        };
    }

    async unblockEntity(entityValue: string) {
        const entity = await this.scamEntityModel.findOne({ entityValue });

        if (!entity) {
            throw new NotFoundException('Entity not found');
        }

        entity.isBlocked = false;
        await entity.save();

        return {
            message: 'Entity unblocked successfully',
            entity,
        };
    }

    private calculateReputationScore(entity: ScamEntity): number {
        // Lower score = worse reputation
        // Factors: report count, amount lost, recency
        const baseScore = 100;
        const reportPenalty = Math.min(entity.reportCount * 5, 80);
        const amountPenalty = Math.min((entity.totalAmountLost / 10000) * 2, 15);

        const score = Math.max(baseScore - reportPenalty - amountPenalty, 0);
        return Math.round(score * 10) / 10;
    }

    private calculateRiskLevel(entity: ScamEntity): RiskLevel {
        if (entity.reportCount >= 50 || entity.totalAmountLost >= 500000) {
            return RiskLevel.CRITICAL;
        } else if (entity.reportCount >= 20 || entity.totalAmountLost >= 100000) {
            return RiskLevel.HIGH;
        } else if (entity.reportCount >= 5 || entity.totalAmountLost >= 10000) {
            return RiskLevel.MEDIUM;
        }
        return RiskLevel.LOW;
    }

    private getWarningMessage(entity: ScamEntity): string {
        switch (entity.riskLevel) {
            case RiskLevel.CRITICAL:
                return `🚨 CRITICAL ALERT: This ${entity.entityType} has been reported ${entity.reportCount} times! DO NOT ENGAGE!`;
            case RiskLevel.HIGH:
                return `⚠️ HIGH RISK: This ${entity.entityType} has ${entity.reportCount} reports. Be very careful!`;
            case RiskLevel.MEDIUM:
                return `⚡ CAUTION: This ${entity.entityType} has been reported ${entity.reportCount} times. Verify before proceeding.`;
            case RiskLevel.LOW:
                return `ℹ️ This ${entity.entityType} has a few reports. Stay alert.`;
            default:
                return 'Information found.';
        }
    }
}
