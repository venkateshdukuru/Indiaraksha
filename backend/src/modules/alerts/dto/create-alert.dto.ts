import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDate,
    MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AlertType, AlertSeverity } from '../schemas/alert.schema';

export class CreateAlertDto {
    @ApiProperty({
        example: 'New UPI Scam Alert in Mumbai',
        description: 'Alert title',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title: string;

    @ApiProperty({
        example: 'Multiple reports of fake payment links targeting senior citizens',
        description: 'Alert message',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    message: string;

    @ApiProperty({
        enum: AlertType,
        example: AlertType.AREA_ALERT,
        description: 'Type of alert',
    })
    @IsEnum(AlertType)
    @IsNotEmpty()
    alertType: AlertType;

    @ApiProperty({
        enum: AlertSeverity,
        example: AlertSeverity.WARNING,
        description: 'Severity level',
    })
    @IsEnum(AlertSeverity)
    @IsNotEmpty()
    severity: AlertSeverity;

    @ApiProperty({
        example: 'Mumbai',
        description: 'City (optional)',
        required: false,
    })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty({
        example: 'Maharashtra',
        description: 'State (optional)',
        required: false,
    })
    @IsOptional()
    @IsString()
    state?: string;

    @ApiProperty({
        example: ['upi_scam'],
        description: 'Related scam types',
        required: false,
    })
    @IsOptional()
    relatedScamTypes?: string[];

    @ApiProperty({
        example: '2024-12-31T23:59:59Z',
        description: 'Alert expiration date (optional)',
        required: false,
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    expiresAt?: Date;
}
