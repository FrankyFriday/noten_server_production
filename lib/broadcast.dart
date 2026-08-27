import 'dart:convert';
import 'dart:io';
import 'client.dart';
import 'roles.dart';
import 'utils.dart';

final List<Client> clients = [];
String? latestVersion;
String? latestApkUrl;

void broadcast(Map<String, dynamic> message) {
  final encoded = jsonEncode(message);
  for (final c in clients.toList()) {
    if (c.socket.readyState == WebSocket.open) {
      try {
        c.socket.add(encoded);
      } catch (_) {
        removeClient(c);
      }
    } else {
      removeClient(c);
    }
  }
}

void broadcastStatus() {
  final musicians = clients.where((c) => c.role == Role.musician).length;
  final conductors = clients.where((c) => c.role == Role.conductor).length;

  broadcast({
    'type': 'status',
    'text': '$musicians Musiker verbunden, $conductors Dirigent(en) verbunden',
  });
}

void removeClient(Client client) {
  clients.remove(client);
  client.close();
  broadcastStatus();
}
