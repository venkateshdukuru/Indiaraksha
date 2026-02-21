import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum ScamType {
    UPI_SCAM = 'upi_scam',
    WHATSAPP_FRAUD = 'whatsapp_fraud',
    FAKE_JOB = 'fake_job',
    PHISHING_WEBSITE = 'phishing_website',
    LOAN_APP_HARASSMENT = 'loan_app_harassment',
    SMS_SCAM = 'sms_scam',
    EMAIL_SCAM = 'email_scam',
    INVESTMENT_FRAUD = 'investment_fraud',
    LOTTERY_SCAM = 'lottery_scam',
    ROMANCE_SCAM = 'romance_scam',
    OTHER = 'other',
}

export enum ReportStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    REJECTED = 'rejected',
    DUPLICATE = 'duplicate',
}

@Schema({ timestamps: true })
export class ScamReport extends Document {
    @ApiProperty({ type: String })
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    reportedBy: Types.ObjectId;

    @ApiProperty({ enum: ScamType })
    @Prop({ type: String, enum: ScamType, required: true })
    scamType: ScamType;

    @ApiProperty({ example: '+919876543210' })
    @Prop({ trim: true })
    phoneNumber?: string;

    @ApiProperty({ example: 'https://fake-website.com' })
    @Prop({ trim: true })
    url?: string;

    @ApiProperty({ example: 'Fake Loan App' })
    @Prop({ trim: true })
    appName?: string;

    @ApiProperty({ example: 'They asked for UPI PIN and transferred money' })
    @Prop({ required: true })
    description: string;

    @ApiProperty({ example: 5000 })
    @Prop({ min: 0 })
    amountLost?: number;

    @ApiProperty({ example: 'Mumbai' })
    @Prop({ trim: true })
    city?: string;

    @ApiProperty({ example: 'Maharashtra' })
    @Prop({ trim: true })
    state?: string;

    @ApiProperty({ enum: ReportStatus })
    @Prop({ type: String, enum: ReportStatus, default: ReportStatus.PENDING })
    status: ReportStatus;

    @ApiProperty({ example: false })
    @Prop({ default: false })
    isAnonymous: boolean;

    @Prop({ type: [String], default: [] })
    evidenceUrls: string[];

    @ApiProperty()
    @Prop()
    incidentDate?: Date;

    @Prop()
    verifiedBy?: Types.ObjectId;

    @Prop()
    verifiedAt?: Date;

    @Prop()
    rejectionReason?: string;

    @ApiProperty({ example: '192.168.1.1' })
    @Prop()
    reporterIp?: string;

    @ApiProperty()
    @Prop()
    createdAt: Date;

    @ApiProperty()
    @Prop()
    updatedAt: Date;
}

export const ScamReportSchema = SchemaFactory.createForClass(ScamReport);

// Indexes
ScamReportSchema.index({ reportedBy: 1 });
ScamReportSchema.index({ scamType: 1 });
ScamReportSchema.index({ status: 1 });
ScamReportSchema.index({ phoneNumber: 1 });
ScamReportSchema.index({ url: 1 });
ScamReportSchema.index({ city: 1, state: 1 });
ScamReportSchema.index({ createdAt: -1 });
