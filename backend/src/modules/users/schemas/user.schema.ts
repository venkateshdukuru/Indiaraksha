import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
}

@Schema({ timestamps: true })
export class User extends Document {
    @ApiProperty({ example: 'john.doe@example.com' })
    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @ApiProperty({ example: '+919876543210' })
    @Prop({ required: true, unique: true, trim: true })
    mobile: string;

    @ApiProperty({ example: 'John Doe' })
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, select: false })
    password: string;

    @ApiProperty({ enum: UserRole, example: UserRole.USER })
    @Prop({ type: String, enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @ApiProperty({ example: true })
    @Prop({ default: true })
    isActive: boolean;

    @ApiProperty({ example: false })
    @Prop({ default: false })
    isEmailVerified: boolean;

    @ApiProperty({ example: false })
    @Prop({ default: false })
    isMobileVerified: boolean;

    @ApiProperty({ example: 'Mumbai' })
    @Prop({ trim: true })
    city?: string;

    @ApiProperty({ example: 'Maharashtra' })
    @Prop({ trim: true })
    state?: string;

    @ApiProperty({ example: '192.168.1.1' })
    @Prop()
    lastLoginIp?: string;

    @ApiProperty()
    @Prop()
    lastLoginAt?: Date;

    @Prop({ type: [String], default: [] })
    refreshTokens: string[];

    @ApiProperty()
    @Prop()
    createdAt: Date;

    @ApiProperty()
    @Prop()
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ mobile: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ city: 1, state: 1 });
