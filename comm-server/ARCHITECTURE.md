# Communication Server Architecture

## Ziel
Ein skalierbarer Echtzeit-Kommunikationsserver für Flutter-Clients, der Versionsinformationen, Release-Metadaten und Update-Benachrichtigungen über REST und WebSockets bereitstellt.

## Architekturprinzipien
- Clean Architecture mit klarer Layer-Trennung
- Domain / Application / Infrastructure
- Repository Pattern für persistente Release-Daten
- Dependency Injection über NestJS
- Konfiguration über Environment Variables
- Structured Logging mit Pino
- Fehlerbehandlung über globale Exception Filter
- Validation über DTOs und ValidationPipe

## Layer
- `src/common`: Infrastruktur- und Cross-Cutting-Concerns
- `src/modules/version`: Release-Management, Versionen und Update-Prozesse
- `src/modules/health`: Health-Endpunkt
- `src/gateways`: WebSocket-Gateway für Live-Broadcasts
- `src/modules/auth`: zukünftige Authentifizierung und API-Key-Schutz

## REST API
- `GET /api/version`
- `GET /api/health`
- `GET /api/releases/latest`
- `POST /api/releases`

## WebSocket
- Namespace `/updates`
- Server → Client Events: `update_available`, `maintenance_mode`, `force_logout`
- Client → Server Events: `client_connected`, `client_version`, `heartbeat`

## Persistenz
- File-basierte Versionsspeicherung über `data/releases.json`
- Repository liest und schreibt Release-Daten
- Sortierung nach `publishedAt` und Versionsnummer

## Security / Auth
- API-Key-Guard als Grundlage für Release-Endpoints
- vorbereitete Authentifizierungsarchitektur für spätere Erweiterungen (OAuth, JWT, API Gateway)

## Skalierungskonzept
- Stateless HTTP und WebSocket-Gateway
- Docker-Container mit reproduzierbarer Build-Pipeline
- zukünftige Erweiterung: Redis Pub/Sub oder Socket.IO Adapter für horizontal skalierte WebSocket-Verbindungen
- Octopus Deploy Integration möglich über Release-Events aus CI/CD

## Monitoring
- Health-Endpoint für Load Balancer und Orchestrator
- strukturierte Logs für zentrale Log-Analyse
- weitere Integration möglich: Prometheus, Grafana, Datadog
