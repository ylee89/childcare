// Boots the static server, runs the e2e suite against it, then shuts down.
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 5174;
const BASE = `http://localhost:${PORT}`;
const ROOT = path.join(__dirname, '..');

// 'ignore' stdio so the long-lived server never holds the parent's output
// stream open (which would hang callers waiting for EOF).
const server = spawn(process.execPath, [path.join(ROOT, 'server.js'), String(PORT)],
  { stdio: 'ignore' });

function waitForServer(retries = 40) {
  return new Promise((resolve, reject) => {
    const tick = () => http.get(BASE, () => resolve()).on('error', () => {
      if (--retries <= 0) reject(new Error('server did not start'));
      else setTimeout(tick, 150);
    });
    tick();
  });
}

(async () => {
  let code = 1;
  try {
    await waitForServer();
    code = await new Promise((resolve) => {
      const e2e = spawn(process.execPath, [path.join(__dirname, 'app.e2e.js')],
        { stdio: 'inherit', env: { ...process.env, BASE } });
      e2e.on('exit', resolve);
    });
  } catch (e) {
    console.error(e.message);
  } finally {
    try { server.kill('SIGKILL'); } catch {}
    process.exit(code);
  }
})();
