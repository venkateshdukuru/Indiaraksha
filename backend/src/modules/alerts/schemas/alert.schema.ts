import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum AlertType {
    TRENDING_SCAM = 'trending_scam',
    NEW_SCAM_PATTERN = 'new_scam_pattern',
    AREA_ALERT = 'area_alert',
    CRITICAL_THREAT = 'critical_threat',
}

export enum AlertSeverity {
    INFO = 'info',
    WARNING = 'warning',
    CRITICAL = 'critical',
}

@Schema({ timestamps: true })
export class Alert extends Document {
    @ApiProperty({ example: 'New UPI Scam Alert in Mumbai' })
    @Prop({ required: true })
    title: string;

    @ApiProperty({ example: 'Multiple reports of fake payment links in Mumbai area' })
    @Prop({ required: true })
    message: string;

    @ApiProperty({ enum: AlertType })
    @Prop({ type: String, enum: AlertType, required: true })
    alertType: AlertType;

    @ApiProperty({ enum: AlertSeverity })
    @Prop({ type: String, enum: AlertSeverity, default: AlertSeverity.INFO })
    severity: AlertSeverity;

    @ApiProperty({ example: 'Mumbai' })
    @Prop()
    city?: string;

    @ApiProperty({ example: 'Maharashtra' })
    @Prop()
    state?: string;

    @ApiProperty({ example: ['upi_scam'] })
    @Prop({ type: [String], default: [] })
    relatedScamTypes: string[];

    @ApiProperty({ example: true })
    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: Types.ObjectId;

    @ApiProperty()
    @Prop()
    expiresAt?: Date;

    @ApiProperty()
    @Prop()
    createdAt: Date;

    @ApiProperty()
    @Prop()
    updatedAt: Date;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);

// Indexes
AlertSchema.index({ isActive: 1 });
AlertSchema.index({ alertType: 1 });
AlertSchema.index({ severity: 1 });
AlertSchema.index({ city: 1, state: 1 });
AlertSchema.index({ createdAt: -1 });
AlertSchema.index({ expiresAt: 1 });
