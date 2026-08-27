# Communication Server

Ein NestJS-basierter Echtzeit-Kommunikationsserver für Flutter-Apps mit Version-Management, WebSocket-Broadcasts und Health-Checks.

## Architektur
- Clean Architecture: Domain, Application, Infrastructure
- REST API + WebSocket Gateway
- Config über Environment Variables
- Structured Logging mit Pino
- Validation & Exception Handling
- Repository Pattern mit file-based persistence
- Future-ready für Octopus Deploy Integration

## Endpoints
- `GET /api/version` - Aktuelle App-Version
- `GET /api/health` - Systemstatus
- `GET /api/releases/latest` - Neueste Release-Daten
- `POST /api/releases` - Neues Release anlegen (API-Key)

## WebSocket Events
- Server → Client: `update_available`, `maintenance_mode`, `force_logout`
- Client → Server: `client_connected`, `client_version`, `heartbeat`

## Entwicklung
```bash
cd comm-server
npm install
npm run start:dev
```

## Docker
```bash
docker compose up --build
```
