// test/parser.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseMarkdown } from '../skill/cardnews/parser.mjs';

test('frontmatter는 title/brand/cta/theme를 읽는다', () => {
  const input = `---
title: 테스트 제목
brand: "@monymony"
cta: 팔로우
theme: warm
---

# 첫 카드`;
  const { frontmatter } = parseMarkdown(input);
  assert.equal(frontmatter.title, '테스트 제목');
  assert.equal(frontmatter.brand, '@monymony');
  assert.equal(frontmatter.cta, '팔로우');
  assert.equal(frontmatter.theme, 'warm');
});

test('--- 로 카드를 분리한다', () => {
  const input = `# 카드1\n\n---\n\n## 카드2\n\n---\n\n## 카드3`;
  const { cards } = parseMarkdown(input);
  assert.equal(cards.length, 3);
});

test('첫 카드의 # 한 개는 자동으로 cover 타입', () => {
  const input = `# 후킹\n\n---\n\n## 본문`;
  const { cards } = parseMarkdown(input);
  assert.equal(cards[0].type, 'cover');
});

test('마지막 카드는 자동으로 cta 타입', () => {
  const input = `# 후킹\n\n---\n\n## 본문\n\n---\n\n## 끝`;
  const { cards } = parseMarkdown(input);
  assert.equal(cards.at(-1).type, 'cta');
});

test('중간 카드의 기본 타입은 body', () => {
  const input = `# 후킹\n\n---\n\n## 본문\n\n---\n\n## 끝`;
  const { cards } = parseMarkdown(input);
  assert.equal(cards[1].type, 'body');
});

test('<!-- card: stat --> 마커는 stat 타입으로 오버라이드', () => {
  const input = `# 후킹\n\n---\n\n<!-- card: stat -->\n**1,200%**\n\n---\n\n## 끝`;
  const { cards } = parseMarkdown(input);
  assert.equal(cards[1].type, 'stat');
});

test('<!-- card: quote --> 마커는 quote 타입으로 오버라이드', () => {
  const input = `# 후킹\n\n---\n\n<!-- card: quote -->\n"인용"\n\n---\n\n## 끝`;
  const { cards } = parseMarkdown(input);
  assert.equal(cards[1].type, 'quote');
});

test('> Note: 줄은 카드 내용에서 제외된다', () => {
  const input = `# 후킹\n> Note: 메모\n\n---\n\n## 끝`;
  const { cards } = parseMarkdown(input);
  assert.ok(!cards[0].raw.includes('Note:'));
});

test('카드 1개만 있어도 cover로 인식, cta로 자동 변환되지 않음', () => {
  const input = `# 한 장뿐`;
  const { cards } = parseMarkdown(input);
  assert.equal(cards.length, 1);
  assert.equal(cards[0].type, 'cover');
});

test('frontmatter가 없어도 동작한다', () => {
  const input = `# 카드1`;
  const { frontmatter, cards } = parseMarkdown(input);
  assert.deepEqual(frontmatter, {});
  assert.equal(cards.length, 1);
});
