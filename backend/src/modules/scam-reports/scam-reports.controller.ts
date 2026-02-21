import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    Ip,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';
import { ScamReportsService } from './scam-reports.service';
import { CreateScamReportDto } from './dto/create-scam-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ScamType, ReportStatus } from './schemas/scam-report.schema';

@ApiTags('Scam Reports')
@Controller('scam-reports')
export class ScamReportsController {
    constructor(private readonly scamReportsService: ScamReportsService) { }

    @Post()
    @ApiOperation({
        summary: 'Report a scam',
        description:
            '🚨 Help protect your community by reporting scams. Your report can save others from fraud. Can be submitted anonymously.',
    })
    @ApiResponse({
        status: 201,
        description: 'Scam reported successfully',
        schema: {
            example: {
                message: 'Thank you for reporting! Your report helps protect others.',
                report: {
                    _id: '507f1f77bcf86cd799439011',
                    scamType: 'upi_scam',
                    phoneNumber: '+919876543210',
                    description: 'Fake UPI payment link',
                    status: 'pending',
                },
            },
        },
    })
    async create(
        @Body() createScamReportDto: CreateScamReportDto,
        @Request() req,
        @Ip() ip: string,
    ) {
        // Extract userId from request if authenticated, otherwise null for anonymous
        const userId = req.user?.userId || null;
        return this.scamReportsService.create(
            createScamReportDto,
            userId,
            ip,
        );
    }

    @Get()
    @ApiOperation({
        summary: 'Get all scam reports',
        description: 'Browse all reported scams to stay informed and protected',
    })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiQuery({ name: 'scamType', required: false, enum: ScamType })
    @ApiQuery({ name: 'status', required: false, enum: ReportStatus })
    @ApiQuery({ name: 'city', required: false })
    @ApiQuery({ name: 'state', required: false })
    @ApiResponse({
        status: 200,
        description: 'List of scam reports',
    })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('scamType') scamType?: ScamType,
        @Query('status') status?: ReportStatus,
        @Query('city') city?: string,
        @Query('state') state?: string,
    ) {
        const filters = { scamType, status, city, state };
        return this.scamReportsService.findAll(filters, page, limit);
    }

    @Get('my-reports')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Get my reports',
        description: 'View all scams you have reported',
    })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiResponse({
        status: 200,
        description: 'Your scam reports',
    })
    async getMyReports(
        @Request() req,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.scamReportsService.getMyReports(req.user.userId, page, limit);
    }

    @Get('statistics')
    @ApiOperation({
        summary: 'Get scam statistics',
        description: 'View platform-wide scam statistics and trends',
    })
    @ApiResponse({
        status: 200,
        description: 'Scam statistics',
        schema: {
            example: {
                totalReports: 1250,
                verifiedReports: 980,
                pendingReports: 270,
                scamTypeStats: [
                    { _id: 'upi_scam', count: 450, totalLoss: 2500000 },
                    { _id: 'fake_job', count: 320, totalLoss: 1800000 },
                ],
            },
        },
    })
    async getStatistics() {
        return this.scamReportsService.getStatistics();
    }

    @Get('trending')
    @ApiOperation({
        summary: 'Get trending scams',
        description: '🔥 See what scams are currently trending in your area',
    })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiResponse({
        status: 200,
        description: 'Trending scams from the last 7 days',
    })
    async getTrendingScams(@Query('limit') limit?: number) {
        return this.scamReportsService.getTrendingScams(limit);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get a specific scam report',
        description: 'View detailed information about a scam report',
    })
    @ApiResponse({
        status: 200,
        description: 'Scam report details',
    })
    @ApiResponse({
        status: 404,
        description: 'Report not found',
    })
    async findOne(@Param('id') id: string) {
        return this.scamReportsService.findOne(id);
    }
}
