String loginPage() {
  return '''
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Login - 🎼 Noten Server</title>
<style>
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg,#1e1e2f,#2c2c3e);
    margin: 0;
    color: #fff;
  }
  .login-box {
    background: #2c2c3e;
    padding: 50px 40px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    text-align: center;
    width: 380px;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .login-box:hover {
    transform: scale(1.03);
    box-shadow: 0 15px 40px rgba(0,0,0,0.7);
  }
  h2 {
    margin-bottom: 30px;
    font-size: 1.9em;
    color: #ff6b6b;
  }
  input {
    width: 100%;
    padding: 14px;
    margin: 12px 0;
    border-radius: 8px;
    border: none;
    font-size: 1em;
  }
  button {
    width: 100%;
    padding: 14px;
    margin-top: 15px;
    border-radius: 8px;
    border: none;
    background: #ff6b6b;
    color: #fff;
    font-weight: bold;
    font-size: 1em;
    cursor: pointer;
    transition: background 0.2s;
  }
  button:hover { background: #ff4757; }
  .footer { font-size: 0.85em; margin-top: 20px; color: #aaa; }
</style>
</head>
<body>
<div class="login-box">
  <h2>🎼 Noten Server Login</h2>
  <form method="POST" action="/login">
    <input type="text" name="username" placeholder="Benutzername" required>
    <input type="password" name="password" placeholder="Passwort" required>
    <button type="submit">Login</button>
  </form>
  <div class="footer">Nur autorisierte Benutzer haben Zugriff</div>
</div>
</body>
</html>
''';
}

String adminPage(int musicians, int conductors) {
  return '''
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Admin Panel - 🎛 Noten Server</title>
<style>
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: #f0f2f5;
    margin: 0;
    color: #333;
  }
  header {
    background: linear-gradient(90deg,#34495e,#2c3e50);
    color: #fff;
    padding: 25px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
  header h2 { margin:0; font-size:1.8em; }
  .stats {
    display: flex;
    gap: 20px;
    font-size: 0.95em;
  }
  .stat-box {
    background: rgba(255,255,255,0.1);
    padding: 8px 12px;
    border-radius: 6px;
    font-weight: bold;
  }
  main {
    padding: 30px 40px;
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(320px,1fr));
    gap: 25px;
  }
  .card {
    background: #fff;
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.08);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.12);
  }
  h3 {
    margin-top: 0;
    color: #34495e;
  }
  input, button {
    width: 100%;
    padding: 12px;
    margin-top: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1em;
  }
  button {
    background: #27ae60;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    border: none;
    transition: background 0.2s;
  }
  button:hover { background: #2ecc71; }
  a.logout {
    display:inline-block;
    margin-top: 15px;
    color:#c0392b;
    text-decoration:none;
    font-weight:bold;
  }
  a.logout:hover { text-decoration:underline; }
</style>
</head>
<body>
<header>
  <h2>🎛 Admin Panel</h2>
  <div class="stats">
    <div class="stat-box">Musiker: <span id="musicians">$musicians</span></div>
    <div class="stat-box">Dirigenten: <span id="conductors">$conductors</span></div>
    <div class="stat-box">CPU: <span id="cpu">--</span>%</div>
    <div class="stat-box">RAM: <span id="ram">--</span> MB</div>
  </div>
</header>
<main>
  <div class="card">
    <h3>Broadcast Nachricht</h3>
    <form method="POST" action="/broadcast">
      <input type="text" name="message" placeholder="Nachricht an alle" required>
      <button type="submit">Senden</button>
    </form>
  </div>
  <div class="card">
    <h3>Release setzen</h3>
    <form method="POST" action="/release">
      <input type="text" name="version" placeholder="Version" required>
      <input type="text" name="apkUrl" placeholder="APK URL" required>
      <button type="submit">Senden</button>
    </form>
  </div>
  <a href="/logout" class="logout">Logout</a>
</main>

<script>
async function fetchStats() {
  try {
    const res = await fetch('/stats');
    if (!res.ok) return;
    const data = await res.json();
    document.getElementById('cpu').textContent = data.cpu.toFixed(1);
    document.getElementById('ram').textContent = data.ram;
  } catch(e){ console.error(e); }
}
setInterval(fetchStats,2000);
fetchStats();
</script>
</body>
</html>
''';
}
