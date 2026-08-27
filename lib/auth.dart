import 'dart:io';
import 'dart:convert';
import 'utils.dart';

final Map<String, String> users = {}; // username -> password
final Map<String, String> sessions = {}; // sessionId -> username

Future<void> loadUsers() async {
  final file = File('users.json');
  if (!await file.exists()) {
    logError('users.json nicht gefunden!');
    exit(1);
  }
  final content = await file.readAsString();
  final data = jsonDecode(content);
  for (var user in data['users']) {
    users[user['username']] = user['password'];
  }
  logInfo('${users.length} Benutzer geladen');
}

bool isLoggedIn(HttpRequest request) {
  final cookie = request.cookies.firstWhere(
      (c) => c.name == 'sessionId', orElse: () => Cookie('', ''));
  return sessions.containsKey(cookie.value);
}

String createSession(String username) {
  final sessionId = generateRandomId();
  sessions[sessionId] = username;
  return sessionId;
}

void destroySession(String sessionId) {
  sessions.remove(sessionId);
}
