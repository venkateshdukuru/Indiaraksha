import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Ip,
    UseGuards,
    Request,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({
        summary: 'Register a new user',
        description:
            'Create a new account to start reporting scams and protecting your community',
    })
    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
        schema: {
            example: {
                user: {
                    _id: '507f1f77bcf86cd799439011',
                    email: 'user@example.com',
                    mobile: '+919876543210',
                    name: 'John Doe',
                    role: 'user',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                },
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                expiresIn: '15m',
            },
        },
    })
    @ApiResponse({ status: 409, description: 'User already exists' })
    async register(@Body() registerDto: RegisterDto, @Ip() ip: string) {
        return this.authService.register(registerDto, ip);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Login to your account',
        description: 'Sign in to access your reports and help protect others',
    })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        schema: {
            example: {
                user: {
                    _id: '507f1f77bcf86cd799439011',
                    email: 'user@example.com',
                    name: 'John Doe',
                    role: 'user',
                },
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                expiresIn: '15m',
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto, @Ip() ip: string) {
        return this.authService.login(loginDto, ip);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Refresh access token',
        description: 'Get a new access token using your refresh token',
    })
    @ApiResponse({
        status: 200,
        description: 'Token refreshed successfully',
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                expiresIn: '15m',
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Logout from your account',
        description: 'Sign out and invalidate your refresh token',
    })
    @ApiResponse({
        status: 200,
        description: 'Logged out successfully',
        schema: {
            example: {
                message: 'Logged out successfully',
            },
        },
    })
    async logout(@Request() req, @Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.logout(req.user.userId, refreshTokenDto.refreshToken);
    }
}
