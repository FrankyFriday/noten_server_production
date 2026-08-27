import 'dart:io';
import 'dart:math';

String generateRandomId([int length = 32]) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  final rand = Random();
  return List.generate(length, (_) => chars[rand.nextInt(chars.length)]).join();
}

void logInfo(String message) {
  final timestamp = DateTime.now().toIso8601String();
  print('[INFO] $timestamp | $message');
}

void logError(String message) {
  final timestamp = DateTime.now().toIso8601String();
  stderr.writeln('[ERROR] $timestamp | $message');
}

/// Liefert CPU-Load (1-Min Durchschnitt) in Prozent und RAM in MB
Future<Map<String, dynamic>> getServerStats() async {
  double cpuPercent = 0.0;
  int ramMb = 0;

  try {
    // RAM in MB
    ramMb = ProcessInfo.currentRss ~/ (1024 * 1024);

    // CPU: Linux Load Average aus /proc/loadavg
    if (Platform.isLinux) {
      final loadavg = await File('/proc/loadavg').readAsString();
      final parts = loadavg.split(' ');
      if (parts.isNotEmpty) {
        final oneMinLoad = double.tryParse(parts[0]) ?? 0.0;
        final cores = Platform.numberOfProcessors;
        cpuPercent = (oneMinLoad / cores) * 100;
      }
    }
  } catch (e) {
    logError('Stats-Fehler: $e');
  }

  return {'cpu': cpuPercent, 'ram': ramMb};
}
