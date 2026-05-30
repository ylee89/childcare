// Feel Friends — tiny zero-dependency static server for the PWA.
// Usage: node server.js [port]   (default 5173)  ->  http://localhost:5173/
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'app');
const PORT = parseInt(process.argv[2] || process.env.PORT || '5173', 10);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.mjs':  'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(ROOT, path.normalize(urlPath));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback to index.html for unknown non-asset routes
      if (!path.extname(filePath)) {
        return fs.readFile(path.join(ROOT, 'index.html'), (e2, idx) => {
          if (e2) { res.writeHead(404); return res.end('Not found'); }
          res.writeHead(200, { 'Content-Type': TYPES['.html'] }); res.end(idx);
        });
      }
      res.writeHead(404); return res.end('Not found');
    }
    const type = TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`Feel Friends running at http://localhost:${PORT}/`));
