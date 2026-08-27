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
var UpdatesGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatesGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const events_constants_1 = require("../common/constants/events.constants");
let UpdatesGateway = UpdatesGateway_1 = class UpdatesGateway {
    constructor() {
        this.logger = new common_1.Logger(UpdatesGateway_1.name);
        this.clients = new Map();
    }
    handleConnection(client) {
        this.clients.set(client.id, {
            socketId: client.id,
            connectedAt: new Date().toISOString(),
        });
        this.logger.log(`Client connected ${client.id}`);
    }
    handleDisconnect(client) {
        this.clients.delete(client.id);
        this.logger.log(`Client disconnected ${client.id}`);
    }
    handleClientConnected(client, payload) {
        this.logger.log({ clientId: payload.clientId }, 'Client registered via WebSocket');
    }
    handleClientVersion(client, payload) {
        const metadata = this.clients.get(client.id);
        if (metadata) {
            metadata.version = payload.version;
            this.clients.set(client.id, metadata);
        }
        this.logger.log({ clientId: client.id, version: payload.version }, 'Client version received');
    }
    handleHeartbeat(client) {
        this.logger.debug({ clientId: client.id }, 'Heartbeat received');
    }
    broadcastUpdate(release) {
        this.logger.log({ version: release.version }, 'Broadcasting update event');
        this.server.emit(events_constants_1.UpdateEvent.UPDATE_AVAILABLE, release);
    }
    broadcastMaintenance(isMaintenance) {
        this.logger.warn({ maintenance: isMaintenance }, 'Broadcasting maintenance mode');
        this.server.emit(events_constants_1.UpdateEvent.MAINTENANCE_MODE, { maintenance: isMaintenance, timestamp: new Date().toISOString() });
    }
    broadcastForceLogout() {
        this.logger.warn('Broadcasting force logout event');
        this.server.emit(events_constants_1.UpdateEvent.FORCE_LOGOUT, { timestamp: new Date().toISOString() });
    }
};
exports.UpdatesGateway = UpdatesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], UpdatesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(events_constants_1.UpdateEvent.CLIENT_CONNECTED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], UpdatesGateway.prototype, "handleClientConnected", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(events_constants_1.UpdateEvent.CLIENT_VERSION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], UpdatesGateway.prototype, "handleClientVersion", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(events_constants_1.UpdateEvent.HEARTBEAT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], UpdatesGateway.prototype, "handleHeartbeat", null);
exports.UpdatesGateway = UpdatesGateway = UpdatesGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/updates',
        cors: {
            origin: true,
            methods: ['GET', 'POST'],
        },
    })
], UpdatesGateway);
