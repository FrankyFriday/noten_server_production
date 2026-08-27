import 'dart:convert';
import 'dart:io';
import 'dart:async';
import 'dart:math';

import 'lib/pages.dart';
import 'lib/utils.dart';
import 'lib/client.dart';
import 'lib/broadcast.dart';
import 'lib/auth.dart';
import 'lib/roles.dart';

// ================== RELEASE MODEL ==================
class Release {
  final String version;
  final String apkUrl;

  Release({required this.version, required this.apkUrl});

  Map<String, dynamic> toJson() => {
        "version": version,
        "apkUrl": apkUrl,
      };
}

// appId -> Release
final Map<String, Release> releases = {};

// ================== CLIENTS ==================
final List<Client> clients = [];

// ================== MAIN ==================
Future<void> main() async {
  await loadUsers();

  final server = await HttpServer.bind(InternetAddress.anyIPv4, 4041);
  logInfo('🎼 Server läuft auf Port 4041');

  await for (HttpRequest request in server) {

    // ================== WEBSOCKET ==================
    if (WebSocketTransformer.isUpgradeRequest(request)) {
      final socket = await WebSocketTransformer.upgrade(request);
      final client = Client(clientId: generateRandomId(), socket: socket);

      clients.add(client);
      client.startPing(removeClient);

      socket.listen(
        (msg) {
          try {
            final map = jsonDecode(msg as String);

            switch (map['type']) {
              case 'register':
                client.role = roleFromString(map['role']);
                broadcastStatus();

                // send app-specific release on connect
                final app = map['app'];
                if (app != null && releases[app] != null) {
                  client.socket.add(jsonEncode({
                    "type": "release_announce",
                    "app": app,
                    "release": releases[app]!.toJson(),
                  }));
                }
                break;

              case 'pong':
                break;

              default:
                broadcast(map);
            }
          } catch (e) {
            logError(e.toString());
          }
        },
        onDone: () => removeClient(client),
        onError: (_) => removeClient(client),
      );

      continue;
    }

    // ================== ROUTING ==================
    final path = request.uri.path;
    final method = request.method;

    // ---------- LOGIN ----------
    if (method == 'GET' && path == '/') {
      request.response
        ..headers.contentType = ContentType.html
        ..write(loginPage())
        ..close();
    }

    else if (method == 'POST' && path == '/login') {
      final body = await utf8.decoder.bind(request).join();
      final params = Uri.splitQueryString(body);

      final username = params['username'];
      final password = params['password'];

      if (username != null && users[username] == password) {
        final sessionId = createSession(username);

        request.response.cookies.add(
          Cookie('sessionId', sessionId)..httpOnly = true,
        );

        request.response
          ..statusCode = HttpStatus.found
          ..headers.set(HttpHeaders.locationHeader, '/admin')
          ..close();
      } else {
        request.response
          ..write("Login fehlgeschlagen")
          ..close();
      }
    }

    // ---------- ADMIN ----------
    else if (method == 'GET' && path == '/admin') {
      if (!isLoggedIn(request)) {
        request.response
          ..statusCode = HttpStatus.found
          ..headers.set(HttpHeaders.locationHeader, '/')
          ..close();
        continue;
      }

      request.response
        ..headers.contentType = ContentType.html
        ..write(adminPage(
          clients.where((c) => c.role == Role.musician).length,
          clients.where((c) => c.role == Role.conductor).length,
        ))
        ..close();
    }

    // ---------- BROADCAST ----------
    else if (method == 'POST' && path == '/broadcast') {
      if (!isLoggedIn(request)) {
        request.response.statusCode = HttpStatus.forbidden;
        request.response.close();
        continue;
      }

      final body = await utf8.decoder.bind(request).join();
      final params = Uri.splitQueryString(body);

      broadcast({
        "type": "admin_message",
        "text": params['message']
      });

      request.response
        ..statusCode = HttpStatus.found
        ..headers.set(HttpHeaders.locationHeader, '/admin')
        ..close();
    }

    // ================== 🚀 RELEASE SYSTEM (NEU) ==================
    else if (method == 'POST' && path == '/api/releases') {
      if (!isLoggedIn(request)) {
        request.response.statusCode = HttpStatus.forbidden;
        request.response.close();
        continue;
      }

      final body = await utf8.decoder.bind(request).join();
      final data = jsonDecode(body);

      final app = data['app'];
      final version = data['version'];
      final apkUrl = data['apkUrl'];

      if (app != null && version != null && apkUrl != null) {
        releases[app] = Release(
          version: version,
          apkUrl: apkUrl,
        );

        broadcast({
          "type": "release_announce",
          "app": app,
          "release": releases[app]!.toJson(),
        });
      }

      request.response
        ..statusCode = HttpStatus.ok
        ..write("ok")
        ..close();
    }

    // ---------- LOGOUT ----------
    else if (method == 'GET' && path == '/logout') {
      final cookie = request.cookies.firstWhere(
        (c) => c.name == 'sessionId',
        orElse: () => Cookie('', ''),
      );

      destroySession(cookie.value);

      request.response.cookies.add(
        Cookie('sessionId', '')
          ..expires = DateTime.now().subtract(Duration(days: 1)),
      );

      request.response
        ..statusCode = HttpStatus.found
        ..headers.set(HttpHeaders.locationHeader, '/')
        ..close();
    }

    // ---------- 404 ----------
    else {
      request.response
        ..statusCode = HttpStatus.notFound
        ..close();
    }
  }
}