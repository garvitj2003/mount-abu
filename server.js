import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    // --- VULNERABILITY FIX: Block TRACE and TRACK ---
    // Intercept the request before the Next.js routing engine sees it
    if (req.method === 'TRACE' || req.method === 'TRACK') {
      res.statusCode = 405;
      res.setHeader('Allow', 'GET, POST, HEAD, PUT, DELETE, OPTIONS');
      res.end('Method Not Allowed');
      return;
    }

    // Let Next.js handle all other normal requests
    try {
      // Parse the url to get the pathname
      const parsedUrl = parse(req.url || '', true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});