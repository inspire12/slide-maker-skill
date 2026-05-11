// test/renderer.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderCard, renderDocument } from '../skill/cardnews/renderer.mjs';

test('cover 카드는 .card.card--cover 클래스를 갖는다', () => {
  const html = renderCard({ type: 'cover', raw: '# 제목', index: 0 }, { total: 3, frontmatter: {} });
  assert.match(html, /class="card card--cover"/);
});

test('body 카드의 마크다운은 HTML로 변환된다', () => {
  const html = renderCard({ type: 'body', raw: '## 제목\n- 항목', index: 1 }, { total: 3, frontmatter: {} });
  assert.match(html, /<h2/);
  assert.match(html, /<ul/);
  assert.match(html, /<li/);
});

test('stat 카드는 .card--stat 클래스를 갖는다', () => {
  const html = renderCard({ type: 'stat', raw: '**1,200%**\n연간 성장률', index: 1 }, { total: 3, frontmatter: {} });
  assert.match(html, /class="card card--stat"/);
});

test('quote 카드는 .card--quote 클래스를 갖는다', () => {
  const html = renderCard({ type: 'quote', raw: '"인용"', index: 1 }, { total: 3, frontmatter: {} });
  assert.match(html, /class="card card--quote"/);
});

test('cta 카드는 .card--cta 클래스를 갖는다', () => {
  const html = renderCard({ type: 'cta', raw: '마지막', index: 2 }, { total: 3, frontmatter: {} });
  assert.match(html, /class="card card--cta"/);
});

test('카드는 페이지네이션을 포함한다 (2/3 등)', () => {
  const html = renderCard({ type: 'body', raw: '본문', index: 1 }, { total: 3, frontmatter: {} });
  assert.match(html, /2\s*\/\s*3/);
});

test('frontmatter.brand가 있으면 카드에 표시된다', () => {
  const html = renderCard({ type: 'cover', raw: '# 제목', index: 0 }, { total: 1, frontmatter: { brand: '@monymony' } });
  assert.match(html, /@monymony/);
});

test('renderDocument는 모든 카드를 단일 HTML로 묶는다', () => {
  const parsed = {
    frontmatter: { title: '테스트', theme: 'mono' },
    cards: [
      { type: 'cover', raw: '# 후킹', index: 0 },
      { type: 'cta', raw: '끝', index: 1 },
    ],
  };
  const html = renderDocument(parsed);
  assert.match(html, /<title>테스트<\/title>/);
  assert.match(html, /data-theme="mono"/);
  assert.match(html, /card--cover/);
  assert.match(html, /card--cta/);
});

test('카드에는 data-index가 부여된다 (export용)', () => {
  const html = renderCard({ type: 'body', raw: '본문', index: 1 }, { total: 3, frontmatter: {} });
  assert.match(html, /data-index="1"/);
});

test('theme 기본값은 mono', () => {
  const html = renderDocument({ frontmatter: {}, cards: [{ type: 'cover', raw: '#X', index: 0 }] });
  assert.match(html, /data-theme="mono"/);
});
