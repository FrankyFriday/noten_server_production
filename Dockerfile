# ===============================
# Dart SDK Image
# ===============================
FROM dart:stable AS build

# Arbeitsverzeichnis setzen
WORKDIR /app

# Pubspec kopieren und Abhängigkeiten holen (Caching nutzen)
COPY pubspec.* ./
RUN dart pub get

# Source Code kopieren
COPY lib/ ./lib/
COPY server.dart ./
COPY users.json ./

# ===============================
# Runtime Image (optional kleiner)
# ===============================
FROM dart:stable

WORKDIR /app

# App-Dateien kopieren
COPY --from=build /app /app

# Non-root User erstellen
RUN useradd -ms /bin/bash dartuser
USER dartuser

# Port freigeben
EXPOSE 4041

# Server starten
CMD ["dart", "server.dart"]
