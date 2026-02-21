import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Body,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ScamReportsService } from '../scam-reports/scam-reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MODERATOR)
@ApiBearerAuth('JWT-auth')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly scamReportsService: ScamReportsService,
    ) { }

    @Get('dashboard')
    @ApiOperation({
        summary: 'Get dashboard statistics',
        description: 'View comprehensive platform statistics',
    })
    @ApiResponse({
        status: 200,
        description: 'Dashboard statistics',
        schema: {
            example: {
                users: {
                    total: 5000,
                    today: 45,
                },
                reports: {
                    total: 1250,
                    pending: 120,
                    verified: 980,
                    rejected: 150,
                    today: 32,
                },
            },
        },
    })
    async getDashboard() {
        return this.adminService.getDashboardStats();
    }

    @Get('reports/pending')
    @ApiOperation({
        summary: 'Get pending reports',
        description: 'View all reports awaiting moderation',
    })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiResponse({
        status: 200,
        description: 'Pending reports',
    })
    async getPendingReports(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.adminService.getPendingReports(page, limit);
    }

    @Post('reports/:id/verify')
    @ApiOperation({
        summary: 'Verify a scam report',
        description: 'Mark a report as verified',
    })
    @ApiResponse({
        status: 200,
        description: 'Report verified successfully',
    })
    async verifyReport(@Param('id') id: string, @Request() req) {
        return this.scamReportsService.verifyReport(id, req.user.userId);
    }

    @Post('reports/:id/reject')
    @ApiOperation({
        summary: 'Reject a scam report',
        description: 'Mark a report as rejected with reason',
    })
    @ApiResponse({
        status: 200,
        description: 'Report rejected',
    })
    async rejectReport(
        @Param('id') id: string,
        @Body('reason') reason: string,
        @Request() req,
    ) {
        return this.scamReportsService.rejectReport(id, req.user.userId, reason);
    }

    @Get('analytics/location')
    @ApiOperation({
        summary: 'Get reports by location',
        description: 'View scam reports grouped by location',
    })
    @ApiResponse({
        status: 200,
        description: 'Location-based analytics',
    })
    async getReportsByLocation() {
        return this.adminService.getReportsByLocation();
    }

    @Get('analytics/trends')
    @ApiOperation({
        summary: 'Get scam trends',
        description: 'View scam trends over time',
    })
    @ApiQuery({ name: 'days', required: false, example: 30 })
    @ApiResponse({
        status: 200,
        description: 'Scam trends',
    })
    async getScamTrends(@Query('days') days?: number) {
        return this.adminService.getScamTrends(days);
    }

    @Get('users')
    @ApiOperation({
        summary: 'Get all users',
        description: 'View all registered users',
    })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiResponse({
        status: 200,
        description: 'List of users',
    })
    async getAllUsers(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.adminService.getAllUsers(page, limit);
    }
}
