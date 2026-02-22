/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.controller.ts":
/*!*******************************!*\
  !*** ./src/app.controller.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const openapi = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./src/app.service.ts");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHealth() {
        return this.appService.getHealth();
    }
    getStats() {
        return this.appService.getStats();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'API is healthy and running',
        schema: {
            example: {
                status: 'success',
                message: '🛡️ IndiaRaksha API is running',
                version: '1.0.0',
                timestamp: '2024-01-01T00:00:00.000Z',
            },
        },
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get platform statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Platform statistics',
        schema: {
            example: {
                totalReports: 1250,
                totalUsers: 5000,
                reportsToday: 45,
                activeAlerts: 3,
            },
        },
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getStats", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);


/***/ }),

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const auth_module_1 = __webpack_require__(/*! ./modules/auth/auth.module */ "./src/modules/auth/auth.module.ts");
const users_module_1 = __webpack_require__(/*! ./modules/users/users.module */ "./src/modules/users/users.module.ts");
const scam_reports_module_1 = __webpack_require__(/*! ./modules/scam-reports/scam-reports.module */ "./src/modules/scam-reports/scam-reports.module.ts");
const scam_entities_module_1 = __webpack_require__(/*! ./modules/scam-entities/scam-entities.module */ "./src/modules/scam-entities/scam-entities.module.ts");
const alerts_module_1 = __webpack_require__(/*! ./modules/alerts/alerts.module */ "./src/modules/alerts/alerts.module.ts");
const admin_module_1 = __webpack_require__(/*! ./modules/admin/admin.module */ "./src/modules/admin/admin.module.ts");
const app_controller_1 = __webpack_require__(/*! ./app.controller */ "./src/app.controller.ts");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./src/app.service.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                    retryWrites: true,
                    w: 'majority',
                }),
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => [
                    {
                        ttl: configService.get('RATE_LIMIT_TTL') || 60000,
                        limit: configService.get('RATE_LIMIT_MAX') || 100,
                    },
                ],
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            scam_reports_module_1.ScamReportsModule,
            scam_entities_module_1.ScamEntitiesModule,
            alerts_module_1.AlertsModule,
            admin_module_1.AdminModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),

/***/ "./src/app.service.ts":
/*!****************************!*\
  !*** ./src/app.service.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let AppService = class AppService {
    getHealth() {
        return {
            status: 'success',
            message: '🛡️ IndiaRaksha API is running',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            mission: 'Protecting citizens from digital fraud',
        };
    }
    getStats() {
        return {
            totalReports: 0,
            totalUsers: 0,
            reportsToday: 0,
            activeAlerts: 0,
            message: 'Platform statistics will be available once data is populated',
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),

/***/ "./src/modules/admin/admin.controller.ts":
/*!***********************************************!*\
  !*** ./src/modules/admin/admin.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminController = void 0;
const openapi = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const admin_service_1 = __webpack_require__(/*! ./admin.service */ "./src/modules/admin/admin.service.ts");
const scam_reports_service_1 = __webpack_require__(/*! ../scam-reports/scam-reports.service */ "./src/modules/scam-reports/scam-reports.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/modules/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
let AdminController = class AdminController {
    constructor(adminService, scamReportsService) {
        this.adminService = adminService;
        this.scamReportsService = scamReportsService;
    }
    async getDashboard() {
        return this.adminService.getDashboardStats();
    }
    async getPendingReports(page, limit) {
        return this.adminService.getPendingReports(page, limit);
    }
    async verifyReport(id, req) {
        return this.scamReportsService.verifyReport(id, req.user.userId);
    }
    async rejectReport(id, reason, req) {
        return this.scamReportsService.rejectReport(id, req.user.userId, reason);
    }
    async getReportsByLocation() {
        return this.adminService.getReportsByLocation();
    }
    async getScamTrends(days) {
        return this.adminService.getScamTrends(days);
    }
    async getAllUsers(page, limit) {
        return this.adminService.getAllUsers(page, limit);
    }
    async getAllReports(page, limit, status) {
        return this.adminService.getAllReports(page, limit, status);
    }
    async deleteReport(id) {
        return this.adminService.deleteReport(id);
    }
    async deactivateUser(id) {
        return this.adminService.deactivateUser(id);
    }
    async activateUser(id) {
        return this.adminService.activateUser(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get dashboard statistics',
        description: 'View comprehensive platform statistics',
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('reports/pending'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get pending reports',
        description: 'View all reports awaiting moderation',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pending reports',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPendingReports", null);
__decorate([
    (0, common_1.Post)('reports/:id/verify'),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify a scam report',
        description: 'Mark a report as verified',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Report verified successfully',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "verifyReport", null);
__decorate([
    (0, common_1.Post)('reports/:id/reject'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reject a scam report',
        description: 'Mark a report as rejected with reason',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Report rejected',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectReport", null);
__decorate([
    (0, common_1.Get)('analytics/location'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get reports by location',
        description: 'View scam reports grouped by location',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Location-based analytics',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReportsByLocation", null);
__decorate([
    (0, common_1.Get)('analytics/trends'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get scam trends',
        description: 'View scam trends over time',
    }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, example: 30 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Scam trends',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getScamTrends", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all users',
        description: 'View all registered users',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of users',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('reports'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reports', description: 'View all scam reports (admin)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllReports", null);
__decorate([
    (0, common_1.Delete)('reports/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a scam report (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteReport", null);
__decorate([
    (0, common_1.Patch)('users/:id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a user account (Admin only)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deactivateUser", null);
__decorate([
    (0, common_1.Patch)('users/:id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate a user account (Admin only)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "activateUser", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.MODERATOR),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        scam_reports_service_1.ScamReportsService])
], AdminController);


/***/ }),

/***/ "./src/modules/admin/admin.module.ts":
/*!*******************************************!*\
  !*** ./src/modules/admin/admin.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const admin_controller_1 = __webpack_require__(/*! ./admin.controller */ "./src/modules/admin/admin.controller.ts");
const admin_service_1 = __webpack_require__(/*! ./admin.service */ "./src/modules/admin/admin.service.ts");
const scam_reports_module_1 = __webpack_require__(/*! ../scam-reports/scam-reports.module */ "./src/modules/scam-reports/scam-reports.module.ts");
const scam_entities_module_1 = __webpack_require__(/*! ../scam-entities/scam-entities.module */ "./src/modules/scam-entities/scam-entities.module.ts");
const alerts_module_1 = __webpack_require__(/*! ../alerts/alerts.module */ "./src/modules/alerts/alerts.module.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const scam_report_schema_1 = __webpack_require__(/*! ../scam-reports/schemas/scam-report.schema */ "./src/modules/scam-reports/schemas/scam-report.schema.ts");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: scam_report_schema_1.ScamReport.name, schema: scam_report_schema_1.ScamReportSchema },
            ]),
            scam_reports_module_1.ScamReportsModule,
            scam_entities_module_1.ScamEntitiesModule,
            alerts_module_1.AlertsModule,
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
    })
], AdminModule);


/***/ }),

/***/ "./src/modules/admin/admin.service.ts":
/*!********************************************!*\
  !*** ./src/modules/admin/admin.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const scam_report_schema_1 = __webpack_require__(/*! ../scam-reports/schemas/scam-report.schema */ "./src/modules/scam-reports/schemas/scam-report.schema.ts");
let AdminService = class AdminService {
    constructor(userModel, scamReportModel) {
        this.userModel = userModel;
        this.scamReportModel = scamReportModel;
    }
    async getDashboardStats() {
        const [totalUsers, totalReports, pendingReports, verifiedReports, rejectedReports, reportsToday, usersToday,] = await Promise.all([
            this.userModel.countDocuments(),
            this.scamReportModel.countDocuments(),
            this.scamReportModel.countDocuments({ status: scam_report_schema_1.ReportStatus.PENDING }),
            this.scamReportModel.countDocuments({ status: scam_report_schema_1.ReportStatus.VERIFIED }),
            this.scamReportModel.countDocuments({ status: scam_report_schema_1.ReportStatus.REJECTED }),
            this.scamReportModel.countDocuments({
                createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            }),
            this.userModel.countDocuments({
                createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            }),
        ]);
        return {
            users: {
                total: totalUsers,
                today: usersToday,
            },
            reports: {
                total: totalReports,
                pending: pendingReports,
                verified: verifiedReports,
                rejected: rejectedReports,
                today: reportsToday,
            },
        };
    }
    async getReportsByLocation() {
        return this.scamReportModel.aggregate([
            {
                $match: {
                    state: { $exists: true, $ne: null },
                },
            },
            {
                $group: {
                    _id: { state: '$state', city: '$city' },
                    count: { $sum: 1 },
                    totalLoss: { $sum: '$amountLost' },
                },
            },
            {
                $sort: { count: -1 },
            },
            {
                $limit: 50,
            },
        ]);
    }
    async getScamTrends(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return this.scamReportModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        scamType: '$scamType',
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { '_id.date': 1 },
            },
        ]);
    }
    async getPendingReports(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [reports, total] = await Promise.all([
            this.scamReportModel
                .find({ status: scam_report_schema_1.ReportStatus.PENDING })
                .populate('reportedBy', 'name email city state')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.scamReportModel.countDocuments({ status: scam_report_schema_1.ReportStatus.PENDING }),
        ]);
        return {
            reports,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getAllUsers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.userModel
                .find()
                .select('-password -refreshTokens')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.userModel.countDocuments(),
        ]);
        return {
            users,
            pagination: { total, page, limit, pages: Math.ceil(total / limit) },
        };
    }
    async getAllReports(page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const query = {};
        if (status)
            query.status = status;
        const [reports, total] = await Promise.all([
            this.scamReportModel
                .find(query)
                .populate('reportedBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.scamReportModel.countDocuments(query),
        ]);
        return {
            reports,
            pagination: { total, page, limit, pages: Math.ceil(total / limit) },
        };
    }
    async deleteReport(id) {
        await this.scamReportModel.findByIdAndDelete(id);
        return { message: 'Report deleted successfully' };
    }
    async deactivateUser(id) {
        await this.userModel.findByIdAndUpdate(id, { isActive: false });
        return { message: 'User deactivated' };
    }
    async activateUser(id) {
        await this.userModel.findByIdAndUpdate(id, { isActive: true });
        return { message: 'User activated' };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(scam_report_schema_1.ScamReport.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AdminService);


/***/ }),

/***/ "./src/modules/alerts/alerts.controller.ts":
/*!*************************************************!*\
  !*** ./src/modules/alerts/alerts.controller.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlertsController = void 0;
const openapi = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const alerts_service_1 = __webpack_require__(/*! ./alerts.service */ "./src/modules/alerts/alerts.service.ts");
const create_alert_dto_1 = __webpack_require__(/*! ./dto/create-alert.dto */ "./src/modules/alerts/dto/create-alert.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/modules/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const alert_schema_1 = __webpack_require__(/*! ./schemas/alert.schema */ "./src/modules/alerts/schemas/alert.schema.ts");
let AlertsController = class AlertsController {
    constructor(alertsService) {
        this.alertsService = alertsService;
    }
    async findAll(page, limit, city, state, alertType, severity) {
        const filters = { city, state, alertType, severity };
        return this.alertsService.findAll(filters, page, limit);
    }
    async getActiveAlerts(city, state) {
        return this.alertsService.getActiveAlerts(city, state);
    }
    async findOne(id) {
        return this.alertsService.findOne(id);
    }
    async create(createAlertDto, req) {
        return this.alertsService.create(createAlertDto, req.user.userId);
    }
    async deactivate(id) {
        return this.alertsService.deactivateAlert(id);
    }
};
exports.AlertsController = AlertsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all alerts',
        description: '📢 View all fraud alerts in your area',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'state', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'alertType', required: false, enum: alert_schema_1.AlertType }),
    (0, swagger_1.ApiQuery)({ name: 'severity', required: false, enum: alert_schema_1.AlertSeverity }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of alerts',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('city')),
    __param(3, (0, common_1.Query)('state')),
    __param(4, (0, common_1.Query)('alertType')),
    __param(5, (0, common_1.Query)('severity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get active alerts',
        description: '🚨 Get currently active fraud alerts for your location',
    }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'state', required: false }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Active alerts',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('city')),
    __param(1, (0, common_1.Query)('state')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getActiveAlerts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get alert details',
        description: 'View detailed information about a specific alert',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alert details',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.MODERATOR),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new alert (Admin only)',
        description: 'Create a fraud alert to warn the community',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Alert created successfully',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_alert_dto_1.CreateAlertDto, Object]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.MODERATOR),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Deactivate an alert (Admin only)',
        description: 'Deactivate an alert when it is no longer relevant',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alert deactivated successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "deactivate", null);
exports.AlertsController = AlertsController = __decorate([
    (0, swagger_1.ApiTags)('Alerts'),
    (0, common_1.Controller)('alerts'),
    __metadata("design:paramtypes", [alerts_service_1.AlertsService])
], AlertsController);


/***/ }),

/***/ "./src/modules/alerts/alerts.module.ts":
/*!*********************************************!*\
  !*** ./src/modules/alerts/alerts.module.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlertsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const alerts_controller_1 = __webpack_require__(/*! ./alerts.controller */ "./src/modules/alerts/alerts.controller.ts");
const alerts_service_1 = __webpack_require__(/*! ./alerts.service */ "./src/modules/alerts/alerts.service.ts");
const alert_schema_1 = __webpack_require__(/*! ./schemas/alert.schema */ "./src/modules/alerts/schemas/alert.schema.ts");
let AlertsModule = class AlertsModule {
};
exports.AlertsModule = AlertsModule;
exports.AlertsModule = AlertsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: alert_schema_1.Alert.name, schema: alert_schema_1.AlertSchema }]),
        ],
        controllers: [alerts_controller_1.AlertsController],
        providers: [alerts_service_1.AlertsService],
        exports: [alerts_service_1.AlertsService],
    })
], AlertsModule);


/***/ }),

/***/ "./src/modules/alerts/alerts.service.ts":
/*!**********************************************!*\
  !*** ./src/modules/alerts/alerts.service.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlertsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const alert_schema_1 = __webpack_require__(/*! ./schemas/alert.schema */ "./src/modules/alerts/schemas/alert.schema.ts");
let AlertsService = class AlertsService {
    constructor(alertModel) {
        this.alertModel = alertModel;
    }
    async create(createAlertDto, adminId) {
        const alert = await this.alertModel.create({
            ...createAlertDto,
            createdBy: new mongoose_2.Types.ObjectId(adminId),
        });
        return {
            message: 'Alert created successfully',
            alert,
        };
    }
    async findAll(filters = {}, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const query = { isActive: true };
        if (filters.city) {
            query.city = new RegExp(filters.city, 'i');
        }
        if (filters.state) {
            query.state = new RegExp(filters.state, 'i');
        }
        if (filters.alertType) {
            query.alertType = filters.alertType;
        }
        if (filters.severity) {
            query.severity = filters.severity;
        }
        const [alerts, total] = await Promise.all([
            this.alertModel
                .find(query)
                .populate('createdBy', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.alertModel.countDocuments(query),
        ]);
        return {
            alerts,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const alert = await this.alertModel
            .findById(id)
            .populate('createdBy', 'name email');
        if (!alert) {
            throw new common_1.NotFoundException('Alert not found');
        }
        return alert;
    }
    async getActiveAlerts(city, state) {
        const query = {
            isActive: true,
            $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gte: new Date() } }],
        };
        if (city) {
            query.city = new RegExp(city, 'i');
        }
        if (state) {
            query.state = new RegExp(state, 'i');
        }
        return this.alertModel
            .find(query)
            .populate('createdBy', 'name')
            .sort({ severity: -1, createdAt: -1 })
            .exec();
    }
    async deactivateAlert(id) {
        const alert = await this.alertModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!alert) {
            throw new common_1.NotFoundException('Alert not found');
        }
        return {
            message: 'Alert deactivated successfully',
            alert,
        };
    }
    async deleteExpiredAlerts() {
        const result = await this.alertModel.deleteMany({
            expiresAt: { $lt: new Date() },
        });
        return {
            message: `Deleted ${result.deletedCount} expired alerts`,
            deletedCount: result.deletedCount,
        };
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(alert_schema_1.Alert.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AlertsService);


/***/ }),

/***/ "./src/modules/alerts/dto/create-alert.dto.ts":
/*!****************************************************!*\
  !*** ./src/modules/alerts/dto/create-alert.dto.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAlertDto = void 0;
const openapi = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
const alert_schema_1 = __webpack_require__(/*! ../schemas/alert.schema */ "./src/modules/alerts/schemas/alert.schema.ts");
class CreateAlertDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String, maxLength: 200 }, message: { required: true, type: () => String, maxLength: 1000 }, alertType: { required: true, enum: (__webpack_require__(/*! ./src/modules/alerts/schemas/alert.schema */ "./src/modules/alerts/schemas/alert.schema.ts").AlertType) }, severity: { required: true, enum: (__webpack_require__(/*! ./src/modules/alerts/schemas/alert.schema */ "./src/modules/alerts/schemas/alert.schema.ts").AlertSeverity) }, city: { required: false, type: () => String }, state: { required: false, type: () => String }, relatedScamTypes: { required: false, type: () => [String] }, expiresAt: { required: false, type: () => Date } };
    }
}
exports.CreateAlertDto = CreateAlertDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'New UPI Scam Alert in Mumbai',
        description: 'Alert title',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Multiple reports of fake payment links targeting senior citizens',
        description: 'Alert message',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: alert_schema_1.AlertType,
        example: alert_schema_1.AlertType.AREA_ALERT,
        description: 'Type of alert',
    }),
    (0, class_validator_1.IsEnum)(alert_schema_1.AlertType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "alertType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: alert_schema_1.AlertSeverity,
        example: alert_schema_1.AlertSeverity.WARNING,
        description: 'Severity level',
    }),
    (0, class_validator_1.IsEnum)(alert_schema_1.AlertSeverity),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Mumbai',
        description: 'City (optional)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Maharashtra',
        description: 'State (optional)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['upi_scam'],
        description: 'Related scam types',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateAlertDto.prototype, "relatedScamTypes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-12-31T23:59:59Z',
        description: 'Alert expiration date (optional)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateAlertDto.prototype, "expiresAt", void 0);


/***/ }),

/***/ "./src/modules/alerts/schemas/alert.schema.ts":
/*!****************************************************!*\
  !*** ./src/modules/alerts/schemas/alert.schema.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlertSchema = exports.Alert = exports.AlertSeverity = exports.AlertType = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
var AlertType;
(function (AlertType) {
    AlertType["TRENDING_SCAM"] = "trending_scam";
    AlertType["NEW_SCAM_PATTERN"] = "new_scam_pattern";
    AlertType["AREA_ALERT"] = "area_alert";
    AlertType["CRITICAL_THREAT"] = "critical_threat";
})(AlertType || (exports.AlertType = AlertType = {}));
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["INFO"] = "info";
    AlertSeverity["WARNING"] = "warning";
    AlertSeverity["CRITICAL"] = "critical";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));
let Alert = class Alert extends mongoose_2.Document {
};
exports.Alert = Alert;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New UPI Scam Alert in Mumbai' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Alert.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Multiple reports of fake payment links in Mumbai area' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Alert.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AlertType }),
    (0, mongoose_1.Prop)({ type: String, enum: AlertType, required: true }),
    __metadata("design:type", String)
], Alert.prototype, "alertType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AlertSeverity }),
    (0, mongoose_1.Prop)({ type: String, enum: AlertSeverity, default: AlertSeverity.INFO }),
    __metadata("design:type", String)
], Alert.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mumbai' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Alert.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Maharashtra' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Alert.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['upi_scam'] }),
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Alert.prototype, "relatedScamTypes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Alert.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Alert.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Alert.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Alert.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Alert.prototype, "updatedAt", void 0);
exports.Alert = Alert = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Alert);
exports.AlertSchema = mongoose_1.SchemaFactory.createForClass(Alert);
exports.AlertSchema.index({ isActive: 1 });
exports.AlertSchema.index({ alertType: 1 });
exports.AlertSchema.index({ severity: 1 });
exports.AlertSchema.index({ city: 1, state: 1 });
exports.AlertSchema.index({ createdAt: -1 });
exports.AlertSchema.index({ expiresAt: 1 });


/***/ }),

/***/ "./src/modules/auth/auth.controller.ts":
/*!*********************************************!*\
  !*** ./src/modules/auth/auth.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const openapi = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const register_dto_1 = __webpack_require__(/*! ./dto/register.dto */ "./src/modules/auth/dto/register.dto.ts");
const login_dto_1 = __webpack_require__(/*! ./dto/login.dto */ "./src/modules/auth/dto/login.dto.ts");
const refresh_token_dto_1 = __webpack_require__(/*! ./dto/refresh-token.dto */ "./src/modules/auth/dto/refresh-token.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ./guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto, ip) {
        return this.authService.register(registerDto, ip);
    }
    async login(loginDto, ip) {
        return this.authService.login(loginDto, ip);
    }
    async refresh(refreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }
    async logout(req, refreshTokenDto) {
        return this.authService.logout(req.user.userId, refreshTokenDto.refreshToken);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: 'Register a new user',
        description: 'Create a new account to start reporting scams and protecting your community',
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User already exists' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Login to your account',
        description: 'Sign in to access your reports and help protect others',
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh access token',
        description: 'Get a new access token using your refresh token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token refreshed successfully',
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                expiresIn: '15m',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid refresh token' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Logout from your account',
        description: 'Sign out and invalidate your refresh token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Logged out successfully',
        schema: {
            example: {
                message: 'Logged out successfully',
            },
        },
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);


/***/ }),

/***/ "./src/modules/auth/auth.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/auth/auth.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/modules/auth/auth.controller.ts");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const jwt_strategy_1 = __webpack_require__(/*! ./strategies/jwt.strategy */ "./src/modules/auth/strategies/jwt.strategy.ts");
const local_strategy_1 = __webpack_require__(/*! ./strategies/local.strategy */ "./src/modules/auth/strategies/local.strategy.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRATION') || '15m',
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, local_strategy_1.LocalStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),

/***/ "./src/modules/auth/auth.service.ts":
/*!******************************************!*\
  !*** ./src/modules/auth/auth.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
let AuthService = class AuthService {
    constructor(userModel, jwtService, configService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto, ip) {
        const { email, mobile, password, name, city, state } = registerDto;
        const existingUser = await this.userModel.findOne({
            $or: [{ email }, { mobile }],
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email or mobile already exists');
        }
        const rounds = parseInt(this.configService.get('BCRYPT_ROUNDS') || '10', 10);
        const hashedPassword = await bcrypt.hash(password, rounds);
        const user = await this.userModel.create({
            email,
            mobile,
            password: hashedPassword,
            name,
            city,
            state,
            lastLoginIp: ip,
            lastLoginAt: new Date(),
        });
        const tokens = await this.generateTokens(user);
        await this.userModel.findByIdAndUpdate(user._id, {
            $push: { refreshTokens: tokens.refreshToken },
        });
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async login(loginDto, ip) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email }).select('+password');
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.userModel.findByIdAndUpdate(user._id, {
            lastLoginIp: ip,
            lastLoginAt: new Date(),
        });
        const tokens = await this.generateTokens(user);
        await this.userModel.findByIdAndUpdate(user._id, {
            $push: { refreshTokens: tokens.refreshToken },
        });
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.userModel.findById(payload.sub);
            if (!user || !user.refreshTokens.includes(refreshToken)) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            await this.userModel.findByIdAndUpdate(user._id, {
                $pull: { refreshTokens: refreshToken },
            });
            const tokens = await this.generateTokens(user);
            await this.userModel.findByIdAndUpdate(user._id, {
                $push: { refreshTokens: tokens.refreshToken },
            });
            return tokens;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId, refreshToken) {
        await this.userModel.findByIdAndUpdate(userId, {
            $pull: { refreshTokens: refreshToken },
        });
        return { message: 'Logged out successfully' };
    }
    async validateUser(email, password) {
        const user = await this.userModel.findOne({ email }).select('+password');
        if (!user || !user.password)
            return null;
        if (await bcrypt.compare(password, user.password)) {
            return this.sanitizeUser(user);
        }
        return null;
    }
    async generateTokens(user) {
        const payload = {
            sub: user._id,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
        });
        return {
            accessToken,
            refreshToken,
            expiresIn: this.configService.get('JWT_EXPIRATION') || '15m',
        };
    }
    sanitizeUser(user) {
        const userObject = user.toObject ? user.toObject() : user;
        delete userObject.password;
        delete userObject.refreshTokens;
        return userObject;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);


/***/ }),

/***/ "./src/modules/auth/decorators/roles.decorator.ts":
/*!********************************************************!*\
  !*** ./src/modules/auth/decorators/roles.decorator.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;


/***/ }),

/***/ "./src/modules/auth/dto/login.dto.ts":
/*!*******************************************!*\
  !*** ./src/modules/auth/dto/login.dto.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const openapi = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class LoginDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'john.doe@example.com',
        description: 'User email address',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'SecurePass123!',
        description: 'User password',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),

/***/ "./src/modules/auth/dto/refresh-token.dto.ts":
/*!***************************************************!*\
  !*** ./src/modules/auth/dto/refresh-token.dto.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RefreshTokenDto = void 0;
const openapi = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class RefreshTokenDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { refreshToken: { required: true, type: () => String } };
    }
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Refresh token received during login',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Refresh token is required' }),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);


/***/ }),

/***/ "./src/modules/auth/dto/register.dto.ts":
/*!**********************************************!*\
  !*** ./src/modules/auth/dto/register.dto.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterDto = void 0;
const openapi = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class RegisterDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, mobile: { required: true, type: () => String, pattern: "/^\\+91[6-9]\\d{9}$/" }, name: { required: true, type: () => String, minLength: 2, maxLength: 100 }, password: { required: true, type: () => String, minLength: 8, pattern: "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/" }, city: { required: false, type: () => String }, state: { required: false, type: () => String } };
    }
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'john.doe@example.com',
        description: 'User email address',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+919876543210',
        description: 'Mobile number with country code',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mobile number is required' }),
    (0, class_validator_1.Matches)(/^\+91[6-9]\d{9}$/, {
        message: 'Please provide a valid Indian mobile number with +91',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "mobile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John Doe',
        description: 'Full name of the user',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is required' }),
    (0, class_validator_1.MinLength)(2, { message: 'Name must be at least 2 characters long' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Name cannot exceed 100 characters' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'SecurePass123!',
        description: 'Password (min 8 characters, must include uppercase, lowercase, number)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Mumbai',
        description: 'City name',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Maharashtra',
        description: 'State name',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "state", void 0);


/***/ }),

/***/ "./src/modules/auth/guards/jwt-auth.guard.ts":
/*!***************************************************!*\
  !*** ./src/modules/auth/guards/jwt-auth.guard.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        return super.canActivate(context);
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),

/***/ "./src/modules/auth/guards/roles.guard.ts":
/*!************************************************!*\
  !*** ./src/modules/auth/guards/roles.guard.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => user.role === role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);


/***/ }),

/***/ "./src/modules/auth/strategies/jwt.strategy.ts":
/*!*****************************************************!*\
  !*** ./src/modules/auth/strategies/jwt.strategy.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
        this.configService = configService;
    }
    async validate(payload) {
        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtStrategy);


/***/ }),

/***/ "./src/modules/auth/strategies/local.strategy.ts":
/*!*******************************************************!*\
  !*** ./src/modules/auth/strategies/local.strategy.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const passport_local_1 = __webpack_require__(/*! passport-local */ "passport-local");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ../auth.service */ "./src/modules/auth/auth.service.ts");
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super({ usernameField: 'email' });
        this.authService = authService;
    }
    async validate(email, password) {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
};
exports.LocalStrategy = LocalStrategy;
exports.LocalStrategy = LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], LocalStrategy);


/***/ }),

/***/ "./src/modules/scam-entities/scam-entities.controller.ts":
/*!***************************************************************!*\
  !*** ./src/modules/scam-entities/scam-entities.controller.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScamEntitiesController = void 0;
const openapi = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const scam_entities_service_1 = __webpack_require__(/*! ./scam-entities.service */ "./src/modules/scam-entities/scam-entities.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/modules/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const scam_entity_schema_1 = __webpack_require__(/*! ./schemas/scam-entity.schema */ "./src/modules/scam-entities/schemas/scam-entity.schema.ts");
let ScamEntitiesController = class ScamEntitiesController {
    constructor(scamEntitiesService) {
        this.scamEntitiesService = scamEntitiesService;
    }
    async lookup(entityValue) {
        return this.scamEntitiesService.lookup(entityValue);
    }
    async search(query, entityType, page, limit) {
        return this.scamEntitiesService.search(query, entityType, page, limit);
    }
    async getTopScammers(limit) {
        return this.scamEntitiesService.getTopScammers(limit);
    }
    async getHighRiskEntities(limit) {
        return this.scamEntitiesService.getHighRiskEntities(limit);
    }
    async blockEntity(entityValue) {
        return this.scamEntitiesService.blockEntity(entityValue);
    }
    async unblockEntity(entityValue) {
        return this.scamEntitiesService.unblockEntity(entityValue);
    }
};
exports.ScamEntitiesController = ScamEntitiesController;
__decorate([
    (0, common_1.Get)('check/:entityValue'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check if a number/URL is reported as scam',
        description: '🔍 Instantly check if a phone number, URL, or app has been reported as a scam',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lookup result',
        schema: {
            examples: {
                found: {
                    value: {
                        found: true,
                        message: '🚨 CRITICAL ALERT: This phone_number has been reported 150 times! DO NOT ENGAGE!',
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
                        message: '✅ No reports found for this number/URL. Stay vigilant!',
                        entityValue: '+919999999999',
                    },
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('entityValue')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScamEntitiesController.prototype, "lookup", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({
        summary: 'Search for scam entities',
        description: 'Search through reported numbers, URLs, and apps',
    }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: true, example: '+9198765' }),
    (0, swagger_1.ApiQuery)({ name: 'entityType', required: false, enum: scam_entity_schema_1.EntityType }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search results',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('entityType')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ScamEntitiesController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('top-scammers'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get most reported scammers',
        description: '📊 View the most frequently reported scam numbers and URLs',
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 50 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Top scammers list',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ScamEntitiesController.prototype, "getTopScammers", null);
__decorate([
    (0, common_1.Get)('high-risk'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get high-risk entities',
        description: '🚨 View all critical and high-risk scam entities',
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 50 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'High-risk entities',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ScamEntitiesController.prototype, "getHighRiskEntities", null);
__decorate([
    (0, common_1.Post)('block/:entityValue'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.MODERATOR),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Block a scam entity (Admin only)',
        description: 'Permanently block a scam number/URL',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Entity blocked successfully',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('entityValue')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScamEntitiesController.prototype, "blockEntity", null);
__decorate([
    (0, common_1.Post)('unblock/:entityValue'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.MODERATOR),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Unblock a scam entity (Admin only)',
        description: 'Remove block from a number/URL',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Entity unblocked successfully',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('entityValue')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScamEntitiesController.prototype, "unblockEntity", null);
exports.ScamEntitiesController = ScamEntitiesController = __decorate([
    (0, swagger_1.ApiTags)('Scam Lookup'),
    (0, common_1.Controller)('scam-lookup'),
    __metadata("design:paramtypes", [scam_entities_service_1.ScamEntitiesService])
], ScamEntitiesController);


/***/ }),

/***/ "./src/modules/scam-entities/scam-entities.module.ts":
/*!***********************************************************!*\
  !*** ./src/modules/scam-entities/scam-entities.module.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScamEntitiesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const scam_entities_controller_1 = __webpack_require__(/*! ./scam-entities.controller */ "./src/modules/scam-entities/scam-entities.controller.ts");
const scam_entities_service_1 = __webpack_require__(/*! ./scam-entities.service */ "./src/modules/scam-entities/scam-entities.service.ts");
const scam_entity_schema_1 = __webpack_require__(/*! ./schemas/scam-entity.schema */ "./src/modules/scam-entities/schemas/scam-entity.schema.ts");
let ScamEntitiesModule = class ScamEntitiesModule {
};
exports.ScamEntitiesModule = ScamEntitiesModule;
exports.ScamEntitiesModule = ScamEntitiesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: scam_entity_schema_1.ScamEntity.name, schema: scam_entity_schema_1.ScamEntitySchema },
            ]),
        ],
        controllers: [scam_entities_controller_1.ScamEntitiesController],
        providers: [scam_entities_service_1.ScamEntitiesService],
        exports: [scam_entities_service_1.ScamEntitiesService],
    })
], ScamEntitiesModule);


/***/ }),

/***/ "./src/modules/scam-entities/scam-entities.service.ts":
/*!************************************************************!*\
  !*** ./src/modules/scam-entities/scam-entities.service.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScamEntitiesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const scam_entity_schema_1 = __webpack_require__(/*! ./schemas/scam-entity.schema */ "./src/modules/scam-entities/schemas/scam-entity.schema.ts");
let ScamEntitiesService = class ScamEntitiesService {
    constructor(scamEntityModel) {
        this.scamEntityModel = scamEntityModel;
    }
    async updateOrCreate(entityType, entityValue, scamType, amountLost) {
        let entity = await this.scamEntityModel.findOne({ entityValue });
        if (!entity) {
            entity = await this.scamEntityModel.create({
                entityType,
                entityValue,
                reportCount: 1,
                scamCategories: [scamType],
                totalAmountLost: amountLost || 0,
                firstReportedAt: new Date(),
                lastReportedAt: new Date(),
            });
        }
        else {
            entity.reportCount += 1;
            entity.totalAmountLost += amountLost || 0;
            entity.lastReportedAt = new Date();
            if (!entity.scamCategories.includes(scamType)) {
                entity.scamCategories.push(scamType);
            }
        }
        entity.reputationScore = this.calculateReputationScore(entity);
        entity.riskLevel = this.calculateRiskLevel(entity);
        await entity.save();
        return entity;
    }
    async lookup(entityValue) {
        const entity = await this.scamEntityModel.findOne({ entityValue });
        if (!entity) {
            return {
                found: false,
                message: '✅ No reports found for this number/URL. Stay vigilant!',
                entityValue,
            };
        }
        return {
            found: true,
            message: this.getWarningMessage(entity),
            entity,
        };
    }
    async search(query, entityType, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const filter = {
            entityValue: new RegExp(query, 'i'),
        };
        if (entityType) {
            filter.entityType = entityType;
        }
        const [entities, total] = await Promise.all([
            this.scamEntityModel
                .find(filter)
                .sort({ reportCount: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.scamEntityModel.countDocuments(filter),
        ]);
        return {
            entities,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getTopScammers(limit = 50) {
        return this.scamEntityModel
            .find()
            .sort({ reportCount: -1 })
            .limit(limit)
            .exec();
    }
    async getHighRiskEntities(limit = 50) {
        return this.scamEntityModel
            .find({ riskLevel: scam_entity_schema_1.RiskLevel.CRITICAL })
            .sort({ reportCount: -1 })
            .limit(limit)
            .exec();
    }
    async blockEntity(entityValue) {
        const entity = await this.scamEntityModel.findOne({ entityValue });
        if (!entity) {
            throw new common_1.NotFoundException('Entity not found');
        }
        entity.isBlocked = true;
        await entity.save();
        return {
            message: 'Entity blocked successfully',
            entity,
        };
    }
    async unblockEntity(entityValue) {
        const entity = await this.scamEntityModel.findOne({ entityValue });
        if (!entity) {
            throw new common_1.NotFoundException('Entity not found');
        }
        entity.isBlocked = false;
        await entity.save();
        return {
            message: 'Entity unblocked successfully',
            entity,
        };
    }
    calculateReputationScore(entity) {
        const baseScore = 100;
        const reportPenalty = Math.min(entity.reportCount * 5, 80);
        const amountPenalty = Math.min((entity.totalAmountLost / 10000) * 2, 15);
        const score = Math.max(baseScore - reportPenalty - amountPenalty, 0);
        return Math.round(score * 10) / 10;
    }
    calculateRiskLevel(entity) {
        if (entity.reportCount >= 50 || entity.totalAmountLost >= 500000) {
            return scam_entity_schema_1.RiskLevel.CRITICAL;
        }
        else if (entity.reportCount >= 20 || entity.totalAmountLost >= 100000) {
            return scam_entity_schema_1.RiskLevel.HIGH;
        }
        else if (entity.reportCount >= 5 || entity.totalAmountLost >= 10000) {
            return scam_entity_schema_1.RiskLevel.MEDIUM;
        }
        return scam_entity_schema_1.RiskLevel.LOW;
    }
    getWarningMessage(entity) {
        switch (entity.riskLevel) {
            case scam_entity_schema_1.RiskLevel.CRITICAL:
                return `🚨 CRITICAL ALERT: This ${entity.entityType} has been reported ${entity.reportCount} times! DO NOT ENGAGE!`;
            case scam_entity_schema_1.RiskLevel.HIGH:
                return `⚠️ HIGH RISK: This ${entity.entityType} has ${entity.reportCount} reports. Be very careful!`;
            case scam_entity_schema_1.RiskLevel.MEDIUM:
                return `⚡ CAUTION: This ${entity.entityType} has been reported ${entity.reportCount} times. Verify before proceeding.`;
            case scam_entity_schema_1.RiskLevel.LOW:
                return `ℹ️ This ${entity.entityType} has a few reports. Stay alert.`;
            default:
                return 'Information found.';
        }
    }
};
exports.ScamEntitiesService = ScamEntitiesService;
exports.ScamEntitiesService = ScamEntitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(scam_entity_schema_1.ScamEntity.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ScamEntitiesService);


/***/ }),

/***/ "./src/modules/scam-entities/schemas/scam-entity.schema.ts":
/*!*****************************************************************!*\
  !*** ./src/modules/scam-entities/schemas/scam-entity.schema.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScamEntitySchema = exports.ScamEntity = exports.RiskLevel = exports.EntityType = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
var EntityType;
(function (EntityType) {
    EntityType["PHONE_NUMBER"] = "phone_number";
    EntityType["URL"] = "url";
    EntityType["APP"] = "app";
    EntityType["EMAIL"] = "email";
})(EntityType || (exports.EntityType = EntityType = {}));
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "low";
    RiskLevel["MEDIUM"] = "medium";
    RiskLevel["HIGH"] = "high";
    RiskLevel["CRITICAL"] = "critical";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
let ScamEntity = class ScamEntity extends mongoose_2.Document {
};
exports.ScamEntity = ScamEntity;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: EntityType }),
    (0, mongoose_1.Prop)({ type: String, enum: EntityType, required: true }),
    __metadata("design:type", String)
], ScamEntity.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+919876543210' }),
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], ScamEntity.prototype, "entityValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150 }),
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], ScamEntity.prototype, "reportCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: RiskLevel }),
    (0, mongoose_1.Prop)({ type: String, enum: RiskLevel, default: RiskLevel.LOW }),
    __metadata("design:type", String)
], ScamEntity.prototype, "riskLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 75.5 }),
    (0, mongoose_1.Prop)({ default: 0, min: 0, max: 100 }),
    __metadata("design:type", Number)
], ScamEntity.prototype, "reputationScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['upi_scam', 'whatsapp_fraud'] }),
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ScamEntity.prototype, "scamCategories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000 }),
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], ScamEntity.prototype, "totalAmountLost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ScamEntity.prototype, "isBlocked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ScamEntity.prototype, "firstReportedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ScamEntity.prototype, "lastReportedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ScamEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ScamEntity.prototype, "updatedAt", void 0);
exports.ScamEntity = ScamEntity = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ScamEntity);
exports.ScamEntitySchema = mongoose_1.SchemaFactory.createForClass(ScamEntity);
exports.ScamEntitySchema.index({ entityValue: 1 }, { unique: true });
exports.ScamEntitySchema.index({ entityType: 1 });
exports.ScamEntitySchema.index({ riskLevel: 1 });
exports.ScamEntitySchema.index({ reportCount: -1 });
exports.ScamEntitySchema.index({ reputationScore: -1 });


/***/ }),

/***/ "./src/modules/scam-reports/dto/create-scam-report.dto.ts":
/*!****************************************************************!*\
  !*** ./src/modules/scam-reports/dto/create-scam-report.dto.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateScamReportDto = void 0;
const openapi = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
const scam_report_schema_1 = __webpack_require__(/*! ../schemas/scam-report.schema */ "./src/modules/scam-reports/schemas/scam-report.schema.ts");
class CreateScamReportDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { scamType: { required: false, enum: (__webpack_require__(/*! ./src/modules/scam-reports/schemas/scam-report.schema */ "./src/modules/scam-reports/schemas/scam-report.schema.ts").ScamType) }, phoneNumber: { required: false, type: () => String }, url: { required: false, type: () => String }, appName: { required: false, type: () => String, maxLength: 100 }, description: { required: false, type: () => String, maxLength: 2000 }, amountLost: { required: false, type: () => Number, minimum: 0 }, city: { required: false, type: () => String }, state: { required: false, type: () => String }, isAnonymous: { required: false, type: () => Boolean }, incidentDate: { required: false, type: () => Date } };
    }
}
exports.CreateScamReportDto = CreateScamReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: scam_report_schema_1.ScamType,
        example: scam_report_schema_1.ScamType.UPI_SCAM,
        description: 'Type of scam',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(scam_report_schema_1.ScamType, { message: 'Please select a valid scam type' }),
    __metadata("design:type", String)
], CreateScamReportDto.prototype, "scamType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+919876543210',
        description: 'Scammer phone number (any format accepted)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScamReportDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://fake-website.com',
        description: 'Scam website URL (if applicable)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScamReportDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Fake Loan App',
        description: 'Name of scam app (if applicable)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateScamReportDto.prototype, "appName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'They sent a fake UPI payment link and asked for my PIN',
        description: 'Detailed description of what happened',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000, {
        message: 'Description cannot exceed 2000 characters',
    }),
    __metadata("design:type", String)
], CreateScamReportDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5000,
        description: 'Amount of money lost (in INR)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Amount cannot be negative' }),
    __metadata("design:type", Number)
], CreateScamReportDto.prototype, "amountLost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Mumbai',
        description: 'City where the scam occurred',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScamReportDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Maharashtra',
        description: 'State where the scam occurred',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScamReportDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Report anonymously (your details will be hidden)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateScamReportDto.prototype, "isAnonymous", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-15T10:30:00Z',
        description: 'When did the scam occur?',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateScamReportDto.prototype, "incidentDate", void 0);


/***/ }),

/***/ "./src/modules/scam-reports/scam-reports.controller.ts":
/*!*************************************************************!*\
  !*** ./src/modules/scam-reports/scam-reports.controller.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScamReportsController = void 0;
const openapi = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const scam_reports_service_1 = __webpack_require__(/*! ./scam-reports.service */ "./src/modules/scam-reports/scam-reports.service.ts");
const create_scam_report_dto_1 = __webpack_require__(/*! ./dto/create-scam-report.dto */ "./src/modules/scam-reports/dto/create-scam-report.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const scam_report_schema_1 = __webpack_require__(/*! ./schemas/scam-report.schema */ "./src/modules/scam-reports/schemas/scam-report.schema.ts");
let ScamReportsController = class ScamReportsController {
    constructor(scamReportsService) {
        this.scamReportsService = scamReportsService;
    }
    async create(createScamReportDto, req, ip) {
        const userId = req.user?.userId || null;
        return this.scamReportsService.create(createScamReportDto, userId, ip);
    }
    async findAll(page, limit, scamType, status, city, state) {
        const filters = { scamType, status, city, state };
        return this.scamReportsService.findAll(filters, page, limit);
    }
    async getMyReports(req, page, limit) {
        return this.scamReportsService.getMyReports(req.user.userId, page, limit);
    }
    async getStatistics() {
        return this.scamReportsService.getStatistics();
    }
    async getTrendingScams(limit) {
        return this.scamReportsService.getTrendingScams(limit);
    }
    async findOne(id) {
        return this.scamReportsService.findOne(id);
    }
};
exports.ScamReportsController = ScamReportsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Report a scam',
        description: '🚨 Help protect your community by reporting scams. Your report can save others from fraud. Can be submitted anonymously.',
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_scam_report_dto_1.CreateScamReportDto, Object, String]),
    __metadata("design:returntype", Promise)
], ScamReportsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all scam reports',
        description: 'Browse all reported scams to stay informed and protected',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }),
    (0, swagger_1.ApiQuery)({ name: 'scamType', required: false, enum: scam_report_schema_1.ScamType }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: scam_report_schema_1.ReportStatus }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'state', required: false }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of scam reports',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('scamType')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('city')),
    __param(5, (0, common_1.Query)('state')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ScamReportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get my reports',
        description: 'View all scams you have reported',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Your scam reports',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], ScamReportsController.prototype, "getMyReports", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get scam statistics',
        description: 'View platform-wide scam statistics and trends',
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScamReportsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('trending'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get trending scams',
        description: '🔥 See what scams are currently trending in your area',
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Trending scams from the last 7 days',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ScamReportsController.prototype, "getTrendingScams", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a specific scam report',
        description: 'View detailed information about a scam report',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Scam report details',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Report not found',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScamReportsController.prototype, "findOne", null);
exports.ScamReportsController = ScamReportsController = __decorate([
    (0, swagger_1.ApiTags)('Scam Reports'),
    (0, common_1.Controller)('scam-reports'),
    __metadata("design:paramtypes", [scam_reports_service_1.ScamReportsService])
], ScamReportsController);


/***/ }),

/***/ "./src/modules/scam-reports/scam-reports.module.ts":
/*!*********************************************************!*\
  !*** ./src/modules/scam-reports/scam-reports.module.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScamReportsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const scam_reports_controller_1 = __webpack_require__(/*! ./scam-reports.controller */ "./src/modules/scam-reports/scam-reports.controller.ts");
const scam_reports_service_1 = __webpack_require__(/*! ./scam-reports.service */ "./src/modules/scam-reports/scam-reports.service.ts");
const scam_report_schema_1 = __webpack_require__(/*! ./schemas/scam-report.schema */ "./src/modules/scam-reports/schemas/scam-report.schema.ts");
const scam_entities_module_1 = __webpack_require__(/*! ../scam-entities/scam-entities.module */ "./src/modules/scam-entities/scam-entities.module.ts");
let ScamReportsModule = class ScamReportsModule {
};
exports.ScamReportsModule = ScamReportsModule;
exports.ScamReportsModule = ScamReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: scam_report_schema_1.ScamReport.name, schema: scam_report_schema_1.ScamReportSchema },
            ]),
            scam_entities_module_1.ScamEntitiesModule,
        ],
        controllers: [scam_reports_controller_1.ScamReportsController],
        providers: [scam_reports_service_1.ScamReportsService],
        exports: [scam_reports_service_1.ScamReportsService],
    })
], ScamReportsModule);


/***/ }),

/***/ "./src/modules/scam-reports/scam-reports.service.ts":
/*!**********************************************************!*\
  !*** ./src/modules/scam-reports/scam-reports.service.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScamReportsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const scam_report_schema_1 = __webpack_require__(/*! ./schemas/scam-report.schema */ "./src/modules/scam-reports/schemas/scam-report.schema.ts");
const scam_entities_service_1 = __webpack_require__(/*! ../scam-entities/scam-entities.service */ "./src/modules/scam-entities/scam-entities.service.ts");
let ScamReportsService = class ScamReportsService {
    constructor(scamReportModel, scamEntitiesService) {
        this.scamReportModel = scamReportModel;
        this.scamEntitiesService = scamEntitiesService;
    }
    async create(createScamReportDto, userId, ip) {
        const { scamType, phoneNumber, url, appName, description, amountLost, city, state, isAnonymous, incidentDate, } = createScamReportDto;
        if (!phoneNumber && !url && !appName) {
            throw new common_1.BadRequestException('Please provide at least one: phone number, URL, or app name');
        }
        const report = await this.scamReportModel.create({
            reportedBy: new mongoose_2.Types.ObjectId(userId),
            scamType,
            phoneNumber,
            url,
            appName,
            description,
            amountLost,
            city,
            state,
            isAnonymous: isAnonymous || false,
            incidentDate,
            reporterIp: ip,
        });
        if (phoneNumber) {
            await this.scamEntitiesService.updateOrCreate('phone_number', phoneNumber, scamType, amountLost);
        }
        if (url) {
            await this.scamEntitiesService.updateOrCreate('url', url, scamType, amountLost);
        }
        if (appName) {
            await this.scamEntitiesService.updateOrCreate('app', appName, scamType, amountLost);
        }
        return {
            message: 'Thank you for reporting! Your report helps protect others.',
            report: await report.populate('reportedBy', 'name email'),
        };
    }
    async findAll(filters = {}, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const query = {};
        if (filters.scamType) {
            query.scamType = filters.scamType;
        }
        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.city) {
            query.city = new RegExp(filters.city, 'i');
        }
        if (filters.state) {
            query.state = new RegExp(filters.state, 'i');
        }
        if (filters.userId) {
            query.reportedBy = new mongoose_2.Types.ObjectId(filters.userId);
        }
        const [reports, total] = await Promise.all([
            this.scamReportModel
                .find(query)
                .populate('reportedBy', 'name city state')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.scamReportModel.countDocuments(query),
        ]);
        return {
            reports,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid report ID');
        }
        const report = await this.scamReportModel
            .findById(id)
            .populate('reportedBy', 'name email city state')
            .populate('verifiedBy', 'name email');
        if (!report) {
            throw new common_1.NotFoundException('Report not found');
        }
        return report;
    }
    async getMyReports(userId, page = 1, limit = 20) {
        return this.findAll({ userId }, page, limit);
    }
    async getStatistics() {
        const [totalReports, verifiedReports, pendingReports, totalAmountLostData, scamTypeStats, recentReports,] = await Promise.all([
            this.scamReportModel.countDocuments(),
            this.scamReportModel.countDocuments({ status: scam_report_schema_1.ReportStatus.VERIFIED }),
            this.scamReportModel.countDocuments({ status: scam_report_schema_1.ReportStatus.PENDING }),
            this.scamReportModel.aggregate([
                { $group: { _id: null, total: { $sum: '$amountLost' } } }
            ]),
            this.scamReportModel.aggregate([
                {
                    $group: {
                        _id: '$scamType',
                        count: { $sum: 1 },
                        totalLoss: { $sum: '$amountLost' },
                    },
                },
                { $sort: { count: -1 } },
            ]),
            this.scamReportModel
                .find()
                .sort({ createdAt: -1 })
                .limit(10)
                .populate('reportedBy', 'name city state'),
        ]);
        return {
            totalReports,
            verifiedReports,
            pendingReports,
            totalAmountLost: totalAmountLostData[0]?.total || 0,
            scamTypeStats,
            recentReports,
        };
    }
    async getTrendingScams(limit = 10) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const trending = await this.scamReportModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo },
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: '$scamType',
                    reportCount: { $sum: 1 },
                    description: { $first: '$description' },
                    state: { $first: '$state' },
                },
            },
            {
                $project: {
                    _id: 0,
                    scamType: '$_id',
                    reportCount: 1,
                    description: 1,
                    state: 1,
                },
            },
            { $sort: { reportCount: -1 } },
            { $limit: limit },
        ]);
        return trending;
    }
    async verifyReport(reportId, adminId) {
        const report = await this.findOne(reportId);
        report.status = scam_report_schema_1.ReportStatus.VERIFIED;
        report.verifiedBy = new mongoose_2.Types.ObjectId(adminId);
        report.verifiedAt = new Date();
        await report.save();
        return {
            message: 'Report verified successfully',
            report,
        };
    }
    async rejectReport(reportId, adminId, reason) {
        const report = await this.findOne(reportId);
        report.status = scam_report_schema_1.ReportStatus.REJECTED;
        report.verifiedBy = new mongoose_2.Types.ObjectId(adminId);
        report.verifiedAt = new Date();
        report.rejectionReason = reason;
        await report.save();
        return {
            message: 'Report rejected',
            report,
        };
    }
};
exports.ScamReportsService = ScamReportsService;
exports.ScamReportsService = ScamReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(scam_report_schema_1.ScamReport.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        scam_entities_service_1.ScamEntitiesService])
], ScamReportsService);


/***/ }),

/***/ "./src/modules/scam-reports/schemas/scam-report.schema.ts":
/*!****************************************************************!*\
  !*** ./src/modules/scam-reports/schemas/scam-report.schema.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScamReportSchema = exports.ScamReport = exports.ReportStatus = exports.ScamType = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
var ScamType;
(function (ScamType) {
    ScamType["UPI_SCAM"] = "upi_scam";
    ScamType["WHATSAPP_FRAUD"] = "whatsapp_fraud";
    ScamType["FAKE_JOB"] = "fake_job";
    ScamType["PHISHING_WEBSITE"] = "phishing_website";
    ScamType["LOAN_APP_HARASSMENT"] = "loan_app_harassment";
    ScamType["SMS_SCAM"] = "sms_scam";
    ScamType["EMAIL_SCAM"] = "email_scam";
    ScamType["INVESTMENT_FRAUD"] = "investment_fraud";
    ScamType["LOTTERY_SCAM"] = "lottery_scam";
    ScamType["ROMANCE_SCAM"] = "romance_scam";
    ScamType["OTHER"] = "other";
})(ScamType || (exports.ScamType = ScamType = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PENDING"] = "pending";
    ReportStatus["VERIFIED"] = "verified";
    ReportStatus["REJECTED"] = "rejected";
    ReportStatus["DUPLICATE"] = "duplicate";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
let ScamReport = class ScamReport extends mongoose_2.Document {
};
exports.ScamReport = ScamReport;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ScamReport.prototype, "reportedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ScamType }),
    (0, mongoose_1.Prop)({ type: String, enum: ScamType, required: true }),
    __metadata("design:type", String)
], ScamReport.prototype, "scamType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+919876543210' }),
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], ScamReport.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://fake-website.com' }),
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], ScamReport.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Fake Loan App' }),
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], ScamReport.prototype, "appName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'They asked for UPI PIN and transferred money' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ScamReport.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000 }),
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], ScamReport.prototype, "amountLost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mumbai' }),
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], ScamReport.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Maharashtra' }),
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], ScamReport.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ReportStatus }),
    (0, mongoose_1.Prop)({ type: String, enum: ReportStatus, default: ReportStatus.PENDING }),
    __metadata("design:type", String)
], ScamReport.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ScamReport.prototype, "isAnonymous", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ScamReport.prototype, "evidenceUrls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ScamReport.prototype, "incidentDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ScamReport.prototype, "verifiedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ScamReport.prototype, "verifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ScamReport.prototype, "rejectionReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '192.168.1.1' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ScamReport.prototype, "reporterIp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ScamReport.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ScamReport.prototype, "updatedAt", void 0);
exports.ScamReport = ScamReport = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ScamReport);
exports.ScamReportSchema = mongoose_1.SchemaFactory.createForClass(ScamReport);
exports.ScamReportSchema.index({ reportedBy: 1 });
exports.ScamReportSchema.index({ scamType: 1 });
exports.ScamReportSchema.index({ status: 1 });
exports.ScamReportSchema.index({ phoneNumber: 1 });
exports.ScamReportSchema.index({ url: 1 });
exports.ScamReportSchema.index({ city: 1, state: 1 });
exports.ScamReportSchema.index({ createdAt: -1 });


/***/ }),

/***/ "./src/modules/users/dto/update-profile.dto.ts":
/*!*****************************************************!*\
  !*** ./src/modules/users/dto/update-profile.dto.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateProfileDto = void 0;
const openapi = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class UpdateProfileDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String, maxLength: 100 }, city: { required: false, type: () => String }, state: { required: false, type: () => String } };
    }
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John Doe',
        description: 'Full name',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Mumbai',
        description: 'City',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Maharashtra',
        description: 'State',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "state", void 0);


/***/ }),

/***/ "./src/modules/users/schemas/user.schema.ts":
/*!**************************************************!*\
  !*** ./src/modules/users/schemas/user.schema.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = exports.UserRole = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
    UserRole["MODERATOR"] = "moderator";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User extends mongoose_2.Document {
};
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john.doe@example.com' }),
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+919876543210' }),
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "mobile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: UserRole, example: UserRole.USER }),
    (0, mongoose_1.Prop)({ type: String, enum: UserRole, default: UserRole.USER }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isMobileVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mumbai' }),
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], User.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Maharashtra' }),
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], User.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '192.168.1.1' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "lastLoginIp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], User.prototype, "refreshTokens", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.index({ email: 1 });
exports.UserSchema.index({ mobile: 1 });
exports.UserSchema.index({ role: 1 });
exports.UserSchema.index({ city: 1, state: 1 });


/***/ }),

/***/ "./src/modules/users/users.controller.ts":
/*!***********************************************!*\
  !*** ./src/modules/users/users.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const openapi = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./src/modules/users/users.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const update_profile_dto_1 = __webpack_require__(/*! ./dto/update-profile.dto */ "./src/modules/users/dto/update-profile.dto.ts");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getProfile(req) {
        return this.usersService.getProfile(req.user.userId);
    }
    async updateProfile(req, updateProfileDto) {
        return this.usersService.updateProfile(req.user.userId, updateProfileDto);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get my profile',
        description: 'View your account information',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User profile',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update my profile',
        description: 'Update your account information',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile updated successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);


/***/ }),

/***/ "./src/modules/users/users.module.ts":
/*!*******************************************!*\
  !*** ./src/modules/users/users.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const users_controller_1 = __webpack_require__(/*! ./users.controller */ "./src/modules/users/users.controller.ts");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./src/modules/users/users.service.ts");
const user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),

/***/ "./src/modules/users/users.service.ts":
/*!********************************************!*\
  !*** ./src/modules/users/users.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findById(id) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email });
    }
    async updateProfile(userId, updateData) {
        const user = await this.userModel.findByIdAndUpdate(userId, { $set: updateData }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            message: 'Profile updated successfully',
            user,
        };
    }
    async getProfile(userId) {
        const user = await this.findById(userId);
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);


/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/mongoose":
/*!***********************************!*\
  !*** external "@nestjs/mongoose" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "@nestjs/throttler":
/*!************************************!*\
  !*** external "@nestjs/throttler" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "class-transformer":
/*!************************************!*\
  !*** external "class-transformer" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("compression");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("passport-local");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const helmet_1 = __webpack_require__(/*! helmet */ "helmet");
const compression = __webpack_require__(/*! compression */ "compression");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    const configService = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)());
    app.use(compression());
    app.enableCors({
        origin: configService.get('CORS_ORIGIN')?.split(',') || '*',
        credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('IndiaRaksha API')
        .setDescription('🛡️ IndiaRaksha - A Secure Scam & Fraud Reporting Platform for the Public\n\n' +
        'This platform helps citizens report scams, check suspicious numbers/links, and receive real-time fraud alerts.\n\n' +
        '**Mission:** Protect families, students, job seekers, and elders from digital fraud.')
        .setVersion('1.0')
        .addTag('Authentication', 'User registration, login, and token management')
        .addTag('Scam Reports', 'Report and manage scam incidents')
        .addTag('Scam Lookup', 'Search and check suspicious numbers/URLs')
        .addTag('Alerts', 'Real-time fraud alerts and notifications')
        .addTag('Admin', 'Administrative and moderation operations')
        .addTag('Users', 'User profile and account management')
        .setContact('IndiaRaksha Team', 'https://indiaraksha.org', 'contact@indiaraksha.org')
        .setLicense('MIT', 'https://opensource.org/licenses/MIT')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your JWT token to access protected routes',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'IndiaRaksha API Documentation',
        customfavIcon: 'https://indiaraksha.vercel.app/favicon.ico',
        customCss: '.swagger-ui .topbar { display: none }',
    });
    const port = configService.get('PORT') || 3000;
    await app.listen(port);
    console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   🛡️  IndiaRaksha - Digital Protection Platform          ║
  ║                                                           ║
  ║   🚀 Server running on: http://localhost:${port}         ║
  ║   📚 API Docs: http://localhost:${port}/api/docs         ║
  ║                                                           ║
  ║   Mission: Protect citizens from digital fraud           ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
}
bootstrap();

})();

/******/ })()
;