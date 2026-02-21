import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum EntityType {
    PHONE_NUMBER = 'phone_number',
    URL = 'url',
    APP = 'app',
    EMAIL = 'email',
}

export enum RiskLevel {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

@Schema({ timestamps: true })
export class ScamEntity extends Document {
    @ApiProperty({ enum: EntityType })
    @Prop({ type: String, enum: EntityType, required: true })
    entityType: EntityType;

    @ApiProperty({ example: '+919876543210' })
    @Prop({ required: true, unique: true, trim: true })
    entityValue: string;

    @ApiProperty({ example: 150 })
    @Prop({ default: 0, min: 0 })
    reportCount: number;

    @ApiProperty({ enum: RiskLevel })
    @Prop({ type: String, enum: RiskLevel, default: RiskLevel.LOW })
    riskLevel: RiskLevel;

    @ApiProperty({ example: 75.5 })
    @Prop({ default: 0, min: 0, max: 100 })
    reputationScore: number;

    @ApiProperty({ example: ['upi_scam', 'whatsapp_fraud'] })
    @Prop({ type: [String], default: [] })
    scamCategories: string[];

    @ApiProperty({ example: 50000 })
    @Prop({ default: 0, min: 0 })
    totalAmountLost: number;

    @ApiProperty({ example: false })
    @Prop({ default: false })
    isBlocked: boolean;

    @ApiProperty()
    @Prop()
    firstReportedAt?: Date;

    @ApiProperty()
    @Prop()
    lastReportedAt?: Date;

    @ApiProperty()
    @Prop()
    createdAt: Date;

    @ApiProperty()
    @Prop()
    updatedAt: Date;
}

export const ScamEntitySchema = SchemaFactory.createForClass(ScamEntity);

// Indexes
ScamEntitySchema.index({ entityValue: 1 }, { unique: true });
ScamEntitySchema.index({ entityType: 1 });
ScamEntitySchema.index({ riskLevel: 1 });
ScamEntitySchema.index({ reportCount: -1 });
ScamEntitySchema.index({ reputationScore: -1 });
