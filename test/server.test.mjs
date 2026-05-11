// test/server.test.mjs
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { startServer } from '../skill/cardnews/server.mjs';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cardnews-srv-'));
const mdPath = path.join(tmpDir, 'source.md');
fs.writeFileSync(mdPath, `---\ntitle: T\n---\n\n# 첫\n\n---\n\n## 끝`);

let server;
let baseUrl;

test('startServer는 URL과 종료 핸들을 반환한다', async () => {
  const handle = await startServer({ mdPath, outDir: tmpDir, openBrowser: false });
  server = handle;
  baseUrl = handle.url;
  assert.match(handle.url, /^http:\/\/127\.0\.0\.1:\d+$/);
});

test('GET / 는 에디터 HTML을 반환한다', async () => {
  const res = await fetch(`${baseUrl}/`);
  assert.equal(res.status, 200);
  const body = await res.text();
  assert.match(body, /<html/i);
});

test('GET /source 는 현재 .md를 반환한다', async () => {
  const res = await fetch(`${baseUrl}/source`);
  assert.equal(res.status, 200);
  const body = await res.text();
  assert.match(body, /title: T/);
});

test('POST /render 는 마크다운 → HTML로 변환한다', async () => {
  const res = await fetch(`${baseUrl}/render`, {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: `# 새 제목`,
  });
  assert.equal(res.status, 200);
  const body = await res.text();
  assert.match(body, /card--cover/);
});

test('POST /save 는 .md를 덮어쓴다', async () => {
  const newContent = `# 갱신된 제목`;
  const res = await fetch(`${baseUrl}/save`, {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: newContent,
  });
  assert.equal(res.status, 204);
  assert.equal(fs.readFileSync(mdPath, 'utf8'), newContent);
});

test('POST /shutdown 은 서버를 종료한다', async () => {
  const res = await fetch(`${baseUrl}/shutdown`, { method: 'POST' });
  assert.equal(res.status, 204);
  await server.closed;
});

after(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});
