"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const version_controller_1 = require("./version.controller");
const version_service_1 = require("./version.service");
const release_repository_1 = require("./repository/release.repository");
const updates_gateway_1 = require("../../gateways/updates.gateway");
const auth_module_1 = require("../auth/auth.module");
let VersionModule = class VersionModule {
};
exports.VersionModule = VersionModule;
exports.VersionModule = VersionModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, auth_module_1.AuthModule],
        controllers: [version_controller_1.VersionController],
        providers: [version_service_1.VersionService, release_repository_1.ReleaseRepository, updates_gateway_1.UpdatesGateway],
        exports: [version_service_1.VersionService],
    })
], VersionModule);
