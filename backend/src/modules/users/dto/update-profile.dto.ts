import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateProfileDto {
    @ApiProperty({
        example: 'John Doe',
        description: 'Full name',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @ApiProperty({
        example: 'Mumbai',
        description: 'City',
        required: false,
    })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty({
        example: 'Maharashtra',
        description: 'State',
        required: false,
    })
    @IsOptional()
    @IsString()
    state?: string;
}
