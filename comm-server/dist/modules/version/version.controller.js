"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionController = void 0;
const common_1 = require("@nestjs/common");
const api_key_guard_1 = require("../../common/guards/api-key.guard");
const create_release_dto_1 = require("./dto/create-release.dto");
const release_response_dto_1 = require("./dto/release-response.dto");
const version_service_1 = require("./version.service");
let VersionController = class VersionController {
    constructor(versionService) {
        this.versionService = versionService;
    }
    getVersion() {
        return this.versionService.getLatestRelease();
    }
    getLatestRelease() {
        return this.versionService.getLatestRelease();
    }
    createRelease(createReleaseDto) {
        return this.versionService.createRelease(createReleaseDto);
    }
};
exports.VersionController = VersionController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", release_response_dto_1.ReleaseResponseDto)
], VersionController.prototype, "getVersion", null);
__decorate([
    (0, common_1.Get)('releases/latest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", release_response_dto_1.ReleaseResponseDto)
], VersionController.prototype, "getLatestRelease", null);
__decorate([
    (0, common_1.Post)('releases'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_release_dto_1.CreateReleaseDto]),
    __metadata("design:returntype", release_response_dto_1.ReleaseResponseDto)
], VersionController.prototype, "createRelease", null);
exports.VersionController = VersionController = __decorate([
    (0, common_1.Controller)('version'),
    __metadata("design:paramtypes", [version_service_1.VersionService])
], VersionController);
