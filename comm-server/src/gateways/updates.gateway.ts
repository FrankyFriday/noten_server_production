import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ReleaseResponseDto } from '../modules/version/dto/release-response.dto';
import { UpdateEvent } from '../common/constants/events.constants';

interface ClientMetadata {
  socketId: string;
  version?: string;
  connectedAt: string;
}

@WebSocketGateway({
  namespace: '/updates',
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
  },
})
export class UpdatesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(UpdatesGateway.name);
  private readonly clients = new Map<string, ClientMetadata>();

  handleConnection(client: Socket) {
    this.clients.set(client.id, {
      socketId: client.id,
      connectedAt: new Date().toISOString(),
    });
    this.logger.log(`Client connected ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
    this.logger.log(`Client disconnected ${client.id}`);
  }

  @SubscribeMessage(UpdateEvent.CLIENT_CONNECTED)
  handleClientConnected(client: Socket, payload: { clientId: string }) {
    this.logger.log({ clientId: payload.clientId }, 'Client registered via WebSocket');
  }

  @SubscribeMessage(UpdateEvent.CLIENT_VERSION)
  handleClientVersion(client: Socket, payload: { version: string }) {
    const metadata = this.clients.get(client.id);
    if (metadata) {
      metadata.version = payload.version;
      this.clients.set(client.id, metadata);
    }
    this.logger.log({ clientId: client.id, version: payload.version }, 'Client version received');
  }

  @SubscribeMessage(UpdateEvent.HEARTBEAT)
  handleHeartbeat(client: Socket) {
    this.logger.debug({ clientId: client.id }, 'Heartbeat received');
  }

  broadcastUpdate(release: ReleaseResponseDto) {
    this.logger.log({ version: release.version }, 'Broadcasting update event');
    this.server.emit(UpdateEvent.UPDATE_AVAILABLE, release);
  }

  broadcastMaintenance(isMaintenance: boolean) {
    this.logger.warn({ maintenance: isMaintenance }, 'Broadcasting maintenance mode');
    this.server.emit(UpdateEvent.MAINTENANCE_MODE, { maintenance: isMaintenance, timestamp: new Date().toISOString() });
  }

  broadcastForceLogout() {
    this.logger.warn('Broadcasting force logout event');
    this.server.emit(UpdateEvent.FORCE_LOGOUT, { timestamp: new Date().toISOString() });
  }
}
