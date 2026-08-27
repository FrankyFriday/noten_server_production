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
var ReleaseRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseRepository = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let ReleaseRepository = ReleaseRepository_1 = class ReleaseRepository {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(ReleaseRepository_1.name);
        this.releases = [];
        const configuredPath = this.configService.get('app.releaseDataPath');
        this.filePath = (0, path_1.join)(process.cwd(), configuredPath ?? './data/releases.json');
        this.ensureStorage();
        this.loadReleases();
    }
    findLatest() {
        return this.releases.length ? this.releases[0] : null;
    }
    findAll() {
        return [...this.releases];
    }
    saveRelease(releaseDto) {
        const newRelease = { ...releaseDto };
        const existingIndex = this.releases.findIndex((item) => item.version === releaseDto.version);
        if (existingIndex >= 0) {
            this.releases[existingIndex] = newRelease;
        }
        else {
            this.releases.push(newRelease);
        }
        this.sortReleases();
        this.persist();
        this.logger.log(`Stored release ${newRelease.version} to ${this.filePath}`);
        return newRelease;
    }
    ensureStorage() {
        const folder = (0, path_1.join)(this.filePath, '..');
        if (!(0, fs_1.existsSync)(folder)) {
            throw new Error(`Release storage folder not found: ${folder}`);
        }
        if (!(0, fs_1.existsSync)(this.filePath)) {
            (0, fs_1.writeFileSync)(this.filePath, JSON.stringify([], null, 2), 'utf8');
            this.logger.warn(`Release storage initialized at ${this.filePath}`);
        }
    }
    loadReleases() {
        try {
            const raw = (0, fs_1.readFileSync)(this.filePath, 'utf8');
            const parsed = JSON.parse(raw);
            this.releases = Array.isArray(parsed) ? parsed : [];
            this.sortReleases();
            this.logger.log(`Loaded ${this.releases.length} release(s)`);
        }
        catch (error) {
            this.logger.error(error, 'Unable to read release storage');
            this.releases = [];
        }
    }
    persist() {
        (0, fs_1.writeFileSync)(this.filePath, JSON.stringify(this.releases, null, 2), 'utf8');
    }
    sortReleases() {
        this.releases.sort((left, right) => {
            if (left.publishedAt === right.publishedAt) {
                return compareVersionStrings(right.version, left.version);
            }
            return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
        });
    }
};
exports.ReleaseRepository = ReleaseRepository;
exports.ReleaseRepository = ReleaseRepository = ReleaseRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ReleaseRepository);
function compareVersionStrings(a, b) {
    const parse = (value) => value.split('.').map((part) => Number(part) || 0);
    const partsA = parse(a);
    const partsB = parse(b);
    for (let index = 0; index < Math.max(partsA.length, partsB.length); index += 1) {
        const diff = (partsA[index] || 0) - (partsB[index] || 0);
        if (diff !== 0) {
            return diff;
        }
    }
    return 0;
}
