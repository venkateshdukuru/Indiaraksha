import {
    Controller,
    Get,
    Post,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';
import { ScamEntitiesService } from './scam-entities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { EntityType } from './schemas/scam-entity.schema';

@ApiTags('Scam Lookup')
@Controller('scam-lookup')
export class ScamEntitiesController {
    constructor(private readonly scamEntitiesService: ScamEntitiesService) { }

    @Get('check/:entityValue')
    @ApiOperation({
        summary: 'Check if a number/URL is reported as scam',
        description:
            '🔍 Instantly check if a phone number, URL, or app has been reported as a scam',
    })
    @ApiResponse({
        status: 200,
        description: 'Lookup result',
        schema: {
            examples: {
                found: {
                    value: {
                        found: true,
                        message:
                            '🚨 CRITICAL ALERT: This phone_number has been reported 150 times! DO NOT ENGAGE!',
                        entity: {
                            entityType: 'phone_number',
                            entityValue: '+919876543210',
                            reportCount: 150,
                            riskLevel: 'critical',
                            reputationScore: 5.0,
                            scamCategories: ['upi_scam', 'whatsapp_fraud'],
                            totalAmountLost: 500000,
                        },
                    },
                },
                notFound: {
                    value: {
                        found: false,
                        message:
                            '✅ No reports found for this number/URL. Stay vigilant!',
                        entityValue: '+919999999999',
                    },
                },
            },
        },
    })
    async lookup(@Param('entityValue') entityValue: string) {
        return this.scamEntitiesService.lookup(entityValue);
    }

    @Get('search')
    @ApiOperation({
        summary: 'Search for scam entities',
        description: 'Search through reported numbers, URLs, and apps',
    })
    @ApiQuery({ name: 'query', required: true, example: '+9198765' })
    @ApiQuery({ name: 'entityType', required: false, enum: EntityType })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiResponse({
        status: 200,
        description: 'Search results',
    })
    async search(
        @Query('query') query: string,
        @Query('entityType') entityType?: EntityType,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.scamEntitiesService.search(query, entityType, page, limit);
    }

    @Get('top-scammers')
    @ApiOperation({
        summary: 'Get most reported scammers',
        description: '📊 View the most frequently reported scam numbers and URLs',
    })
    @ApiQuery({ name: 'limit', required: false, example: 50 })
    @ApiResponse({
        status: 200,
        description: 'Top scammers list',
    })
    async getTopScammers(@Query('limit') limit?: number) {
        return this.scamEntitiesService.getTopScammers(limit);
    }

    @Get('high-risk')
    @ApiOperation({
        summary: 'Get high-risk entities',
        description: '🚨 View all critical and high-risk scam entities',
    })
    @ApiQuery({ name: 'limit', required: false, example: 50 })
    @ApiResponse({
        status: 200,
        description: 'High-risk entities',
    })
    async getHighRiskEntities(@Query('limit') limit?: number) {
        return this.scamEntitiesService.getHighRiskEntities(limit);
    }

    @Post('block/:entityValue')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MODERATOR)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Block a scam entity (Admin only)',
        description: 'Permanently block a scam number/URL',
    })
    @ApiResponse({
        status: 200,
        description: 'Entity blocked successfully',
    })
    async blockEntity(@Param('entityValue') entityValue: string) {
        return this.scamEntitiesService.blockEntity(entityValue);
    }

    @Post('unblock/:entityValue')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MODERATOR)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Unblock a scam entity (Admin only)',
        description: 'Remove block from a number/URL',
    })
    @ApiResponse({
        status: 200,
        description: 'Entity unblocked successfully',
    })
    async unblockEntity(@Param('entityValue') entityValue: string) {
        return this.scamEntitiesService.unblockEntity(entityValue);
    }
}
