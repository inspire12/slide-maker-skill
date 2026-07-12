// skill/cardnews/renderer.mjs
import { marked } from 'marked';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(__dirname, 'template.html');

marked.setOptions({ gfm: true, breaks: false });

export function renderCard(card, ctx) {
  const { total, frontmatter } = ctx;
  const bodyHtml = marked.parse(card.raw || '');
  const brand = frontmatter.brand
    ? `<div class="card__brand">${escapeHtml(frontmatter.brand)}</div>`
    : '';
  const pagination = total > 1
    ? `<div class="card__pagination">${card.index + 1} / ${total}</div>`
    : '';
  return `<section class="card card--${card.type}" data-index="${card.index}">
${brand}
<div class="card__body">${bodyHtml}</div>
${pagination}
</section>`;
}

export function renderDocument(parsed) {
  const { frontmatter, cards } = parsed;
  const theme = frontmatter.theme || 'mono';
  const title = frontmatter.title || 'Cardnews';
  const total = cards.length;
  const cardsHtml = cards.map(c => renderCard(c, { total, frontmatter })).join('\n');

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  return template
    .replace('<html lang="ko">', `<html lang="ko" data-theme="${theme}">`)
    .replace('{{TITLE}}', escapeHtml(title))
    .replace('{{CARDS}}', cardsHtml);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}
