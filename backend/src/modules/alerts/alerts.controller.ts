import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Query,
    Body,
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
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { AlertType, AlertSeverity } from './schemas/alert.schema';

@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {
    constructor(private readonly alertsService: AlertsService) { }

    @Get()
    @ApiOperation({
        summary: 'Get all alerts',
        description: '📢 View all fraud alerts in your area',
    })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiQuery({ name: 'city', required: false })
    @ApiQuery({ name: 'state', required: false })
    @ApiQuery({ name: 'alertType', required: false, enum: AlertType })
    @ApiQuery({ name: 'severity', required: false, enum: AlertSeverity })
    @ApiResponse({
        status: 200,
        description: 'List of alerts',
    })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('city') city?: string,
        @Query('state') state?: string,
        @Query('alertType') alertType?: AlertType,
        @Query('severity') severity?: AlertSeverity,
    ) {
        const filters = { city, state, alertType, severity };
        return this.alertsService.findAll(filters, page, limit);
    }

    @Get('active')
    @ApiOperation({
        summary: 'Get active alerts',
        description: '🚨 Get currently active fraud alerts for your location',
    })
    @ApiQuery({ name: 'city', required: false })
    @ApiQuery({ name: 'state', required: false })
    @ApiResponse({
        status: 200,
        description: 'Active alerts',
    })
    async getActiveAlerts(
        @Query('city') city?: string,
        @Query('state') state?: string,
    ) {
        return this.alertsService.getActiveAlerts(city, state);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get alert details',
        description: 'View detailed information about a specific alert',
    })
    @ApiResponse({
        status: 200,
        description: 'Alert details',
    })
    async findOne(@Param('id') id: string) {
        return this.alertsService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MODERATOR)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Create a new alert (Admin only)',
        description: 'Create a fraud alert to warn the community',
    })
    @ApiResponse({
        status: 201,
        description: 'Alert created successfully',
    })
    async create(@Body() createAlertDto: CreateAlertDto, @Request() req) {
        return this.alertsService.create(createAlertDto, req.user.userId);
    }

    @Patch(':id/deactivate')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MODERATOR)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Deactivate an alert (Admin only)',
        description: 'Deactivate an alert when it is no longer relevant',
    })
    @ApiResponse({
        status: 200,
        description: 'Alert deactivated successfully',
    })
    async deactivate(@Param('id') id: string) {
        return this.alertsService.deactivateAlert(id);
    }
}
