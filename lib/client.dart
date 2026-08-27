import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'roles.dart';

class Client {
  final String clientId;
  final WebSocket socket;
  Role role;
  Timer? pingTimer;

  Client({
    required this.clientId,
    required this.socket,
    this.role = Role.unknown,
  });

  void startPing(void Function(Client) onRemove) {
    pingTimer?.cancel();
    pingTimer = Timer.periodic(const Duration(seconds: 10), (_) {
      try {
        if (socket.readyState == WebSocket.open) {
          socket.add(jsonEncode({'type': 'ping'}));
        } else {
          onRemove(this);
        }
      } catch (_) {
        onRemove(this);
      }
    });
  }

  void close() {
    pingTimer?.cancel();
    try {
      socket.close();
    } catch (_) {}
  }
}
