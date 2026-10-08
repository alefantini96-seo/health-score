// Server locale: serve public/. Nessuna dipendenza.
//
//     C:/dev/tools/node/node.exe scripts/server.mjs        → http://localhost:8788

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBBLICO = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const TIPI = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
};

export function avvia({ porta = 8788, radice = PUBBLICO } = {}) {
  const server = createServer(async (req, res) => {
    const u = new URL(req.url, 'http://localhost');
    const relativo = normalize(decodeURIComponent(u.pathname)).replace(/^[\\/]+/, '');
    if (relativo.startsWith('..')) { res.writeHead(403).end(); return; }
    const file = join(radice, relativo.endsWith('/') || relativo === '' || relativo === '.' ? join(relativo, 'index.html') : relativo);
    try {
      const dati = await readFile(file);
      res.writeHead(200, { 'content-type': TIPI[extname(file)] ?? 'application/octet-stream' });
      res.end(dati);
    } catch {
      res.writeHead(404).end('non trovato');
    }
  });
  return new Promise((ok) => server.listen(porta, '127.0.0.1', () => ok(server)));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const s = await avvia();
  console.log(`http://localhost:${s.address().port}`);
}
