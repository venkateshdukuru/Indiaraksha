import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    IsBoolean,
    IsDate,
    Min,
    MaxLength,
    Matches,
    IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ScamType } from '../schemas/scam-report.schema';

export class CreateScamReportDto {
    @ApiProperty({
        enum: ScamType,
        example: ScamType.UPI_SCAM,
        description: 'Type of scam',
        required: false,
    })
    @IsOptional()
    @IsEnum(ScamType, { message: 'Please select a valid scam type' })
    scamType?: ScamType;

    @ApiProperty({
        example: '+919876543210',
        description: 'Scammer phone number (any format accepted)',
        required: false,
    })
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @ApiProperty({
        example: 'https://fake-website.com',
        description: 'Scam website URL (if applicable)',
        required: false,
    })
    @IsOptional()
    @IsString()
    url?: string;

    @ApiProperty({
        example: 'Fake Loan App',
        description: 'Name of scam app (if applicable)',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    appName?: string;

    @ApiProperty({
        example: 'They sent a fake UPI payment link and asked for my PIN',
        description: 'Detailed description of what happened',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(2000, {
        message: 'Description cannot exceed 2000 characters',
    })
    description?: string;

    @ApiProperty({
        example: 5000,
        description: 'Amount of money lost (in INR)',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'Amount cannot be negative' })
    amountLost?: number;

    @ApiProperty({
        example: 'Mumbai',
        description: 'City where the scam occurred',
        required: false,
    })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty({
        example: 'Maharashtra',
        description: 'State where the scam occurred',
        required: false,
    })
    @IsOptional()
    @IsString()
    state?: string;

    @ApiProperty({
        example: false,
        description: 'Report anonymously (your details will be hidden)',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isAnonymous?: boolean;

    @ApiProperty({
        example: '2024-01-15T10:30:00Z',
        description: 'When did the scam occur?',
        required: false,
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    incidentDate?: Date;
}
