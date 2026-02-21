import {
    Controller,
    Get,
    Patch,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('profile')
    @ApiOperation({
        summary: 'Get my profile',
        description: 'View your account information',
    })
    @ApiResponse({
        status: 200,
        description: 'User profile',
    })
    async getProfile(@Request() req) {
        return this.usersService.getProfile(req.user.userId);
    }

    @Patch('profile')
    @ApiOperation({
        summary: 'Update my profile',
        description: 'Update your account information',
    })
    @ApiResponse({
        status: 200,
        description: 'Profile updated successfully',
    })
    async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
        return this.usersService.updateProfile(req.user.userId, updateProfileDto);
    }
}
