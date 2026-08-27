import 'dart:convert';
import 'dart:io';

class Client {
  WebSocket socket;
  String role;
  String? instrument;
  String? voice;

  Client(this.socket, this.role, {this.instrument, this.voice});
}

final List<Client> clients = [];

void main() async {
  final server = await HttpServer.bind(InternetAddress.anyIPv4, 4041);
  print('🎼 WebSocket Server läuft auf Port 4041');

  await for (HttpRequest req in server) {
    if (!WebSocketTransformer.isUpgradeRequest(req)) {
      req.response
        ..statusCode = HttpStatus.forbidden
        ..close();
      continue;
    }

    final socket = await WebSocketTransformer.upgrade(req);

    socket.listen(
      (data) => handleMessage(socket, data),
      onDone: () => removeClient(socket),
      onError: (_) => removeClient(socket),
    );
  }
}

void handleMessage(WebSocket socket, dynamic data) {
  final msg = jsonDecode(data);

  switch (msg['type']) {
    case 'register':
      clients.add(Client(
        socket,
        msg['role'],
        instrument: msg['instrument'],
        voice: msg['voice'],
      ));
      socket.add(jsonEncode({
        'type': 'status',
        'text': 'registriert'
      }));
      break;

    case 'send_piece':
      for (final c in clients) {
        if (c.role != 'musician') continue;
        if (c.instrument == msg['instrument'] &&
            c.voice == msg['voice']) {
          c.socket.add(jsonEncode(msg));
        }
      }
      break;

    case 'end_piece':
      for (final c in clients) {
        if (c.role == 'musician') {
          c.socket.add(jsonEncode({
            'type': 'end_piece'
          }));
        }
      }
      break;
  }
}

void removeClient(WebSocket socket) {
  clients.removeWhere((c) => c.socket == socket);
}
