import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    Matches,
    IsOptional,
} from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'User email address',
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({
        example: '+919876543210',
        description: 'Mobile number with country code',
    })
    @IsString()
    @IsNotEmpty({ message: 'Mobile number is required' })
    @Matches(/^\+91[6-9]\d{9}$/, {
        message: 'Please provide a valid Indian mobile number with +91',
    })
    mobile: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'Full name of the user',
    })
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
    name: string;

    @ApiProperty({
        example: 'SecurePass123!',
        description: 'Password (min 8 characters, must include uppercase, lowercase, number)',
    })
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    })
    password: string;

    @ApiProperty({
        example: 'Mumbai',
        description: 'City name',
        required: false,
    })
    @IsString()
    @IsOptional()
    city?: string;

    @ApiProperty({
        example: 'Maharashtra',
        description: 'State name',
        required: false,
    })
    @IsString()
    @IsOptional()
    state?: string;
}
