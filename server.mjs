import http from 'node:http';
import { readFile } from 'node:fs/promises';

const server = http.createServer(async (req, res) => {
  try {
    const routes = {
      '/api/health': 'https://api.flop.network/health',
      '/api/models': 'https://api.flop.network/v1/models'
    };

    if (routes[req.url]) {
      const upstream = await fetch(routes[req.url], {
        signal: AbortSignal.timeout(15000)
      });
      res.writeHead(upstream.status, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      });
      res.end(await upstream.text());
    } else if (req.url === '/') {
      const html = await readFile(
        new URL('./index.html', import.meta.url)
      );
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
      });
      res.end(html);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  } catch (error) {
    res.writeHead(502, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({error: error.message}));
  }
});

server.listen(8787, '127.0.0.1', () => {
  console.log('FLOP Network Monitor');
  console.log('http://localhost:8787');
});
