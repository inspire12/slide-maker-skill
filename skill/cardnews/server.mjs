// skill/cardnews/server.mjs
// Usage: node skill/cardnews/server.mjs <md-path> [<out-dir>]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseMarkdown } from './parser.mjs';
import { renderDocument } from './renderer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EDITOR_DIR = path.join(__dirname, 'editor');

export async function startServer({ mdPath, outDir, openBrowser = true }) {
  const server = http.createServer(async (req, res) => {
    try {
      if (req.method === 'GET' && req.url === '/') {
        return serveFile(res, path.join(EDITOR_DIR, 'index.html'), 'text/html');
      }
      if (req.method === 'GET' && req.url === '/editor.css') {
        return serveFile(res, path.join(EDITOR_DIR, 'editor.css'), 'text/css');
      }
      if (req.method === 'GET' && req.url === '/editor.js') {
        return serveFile(res, path.join(EDITOR_DIR, 'editor.js'), 'application/javascript');
      }
      if (req.method === 'GET' && req.url === '/source') {
        const md = fs.readFileSync(mdPath, 'utf8');
        res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
        return res.end(md);
      }
      if (req.method === 'POST' && req.url === '/render') {
        const body = await readBody(req);
        const parsed = parseMarkdown(body);
        const html = renderDocument(parsed);
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        return res.end(html);
      }
      if (req.method === 'POST' && req.url === '/save') {
        const body = await readBody(req);
        fs.writeFileSync(mdPath, body);
        res.writeHead(204);
        return res.end();
      }
      if (req.method === 'POST' && req.url === '/export') {
        const body = await readBody(req);
        fs.writeFileSync(mdPath, body);
        const parsed = parseMarkdown(body);
        const previewPath = path.join(outDir, 'preview.html');
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(previewPath, renderDocument(parsed));
        const pngDir = path.join(outDir, 'png');
        await runExport(previewPath, pngDir);
        res.writeHead(200, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({ pngDir, count: parsed.cards.length }));
      }
      if (req.method === 'POST' && req.url === '/shutdown') {
        res.writeHead(204);
        res.end();
        setImmediate(() => closeServer());
        return;
      }
      res.writeHead(404); res.end('not found');
    } catch (err) {
      res.writeHead(500, { 'content-type': 'text/plain' });
      res.end(String(err && err.stack || err));
    }
  });

  let resolveClosed;
  const closed = new Promise(r => { resolveClosed = r; });
  function closeServer() {
    server.close(() => resolveClosed());
  }

  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  const url = `http://127.0.0.1:${port}`;

  if (openBrowser) {
    const opener = process.platform === 'darwin' ? 'open' :
                   process.platform === 'win32' ? 'start' : 'xdg-open';
    spawn(opener, [url], { stdio: 'ignore', detached: true }).unref();
  }

  return { url, closed, close: closeServer };
}

function serveFile(res, filePath, mime) {
  res.writeHead(200, { 'content-type': `${mime}; charset=utf-8` });
  fs.createReadStream(filePath).pipe(res);
}

const MAX_BODY = 10 * 1024 * 1024;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    let size = 0;
    req.on('data', c => {
      size += c.length;
      if (size > MAX_BODY) {
        req.destroy();
        reject(new Error(`body too large (> ${MAX_BODY} bytes)`));
        return;
      }
      data += c;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function runExport(htmlPath, outDir) {
  return new Promise((resolve, reject) => {
    const exportScript = path.join(__dirname, 'export.mjs');
    const proc = spawn(process.execPath, [exportScript, htmlPath, outDir], { stdio: 'inherit' });
    proc.on('exit', code => code === 0 ? resolve() : reject(new Error(`export exit ${code}`)));
  });
}

const isMain = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || '');
if (isMain) {
  const [, , mdArg, outArg] = process.argv;
  if (!mdArg) {
    console.error('Usage: node server.mjs <md-path> [<out-dir>]');
    process.exit(1);
  }
  const outDir = outArg || path.dirname(mdArg);
  startServer({ mdPath: mdArg, outDir })
    .then(h => console.log(`Editor at ${h.url}\nPress Ctrl+C or click 완료 to stop.`));
}
