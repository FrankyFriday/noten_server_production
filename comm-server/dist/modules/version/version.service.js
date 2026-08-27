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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionService = void 0;
const common_1 = require("@nestjs/common");
const release_repository_1 = require("./repository/release.repository");
const updates_gateway_1 = require("../../gateways/updates.gateway");
let VersionService = class VersionService {
    constructor(releaseRepository, updatesGateway) {
        this.releaseRepository = releaseRepository;
        this.updatesGateway = updatesGateway;
    }
    getLatestRelease() {
        const latestRelease = this.releaseRepository.findLatest();
        if (!latestRelease) {
            throw new common_1.NotFoundException('No release data available');
        }
        return { ...latestRelease };
    }
    createRelease(releaseDto) {
        const savedRelease = this.releaseRepository.saveRelease(releaseDto);
        this.updatesGateway.broadcastUpdate({ ...savedRelease });
        return { ...savedRelease };
    }
};
exports.VersionService = VersionService;
exports.VersionService = VersionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [release_repository_1.ReleaseRepository,
        updates_gateway_1.UpdatesGateway])
], VersionService);
