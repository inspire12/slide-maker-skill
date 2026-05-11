// skill/cardnews/editor/editor.js
const $editor = document.getElementById('editor');
const $preview = document.getElementById('preview');
const $status = document.getElementById('status');
const $theme = document.getElementById('theme');
const $exportBtn = document.getElementById('exportBtn');
const $doneBtn = document.getElementById('doneBtn');

let saveTimer = null;
let renderTimer = null;
let currentSource = '';

const TYPE_OPTIONS = ['cover', 'body', 'stat', 'quote', 'cta'];

async function bootstrap() {
  const res = await fetch('/source');
  currentSource = await res.text();
  $editor.value = currentSource;
  syncThemeFromSource();
  await rerender();
}

$editor.addEventListener('input', () => {
  clearTimeout(saveTimer); clearTimeout(renderTimer);
  $status.textContent = '편집 중…';
  renderTimer = setTimeout(rerender, 200);
  saveTimer = setTimeout(save, 600);
});

$theme.addEventListener('change', () => {
  $editor.value = updateFrontmatterKey($editor.value, 'theme', $theme.value);
  rerender(); save();
});

$exportBtn.addEventListener('click', exportPngs);
$doneBtn.addEventListener('click', shutdown);

async function rerender() {
  const res = await fetch('/render', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: $editor.value });
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const cards = [...doc.querySelectorAll('.card')];
  $preview.innerHTML = '';
  cards.forEach((card, i) => attachCardControls(card, i));
  cards.forEach(card => $preview.appendChild(card));
}

function attachCardControls(card, i) {
  card.draggable = true;
  card.addEventListener('dragstart', e => {
    card.classList.add('dragging');
    e.dataTransfer.setData('text/plain', String(i));
  });
  card.addEventListener('dragend', () => card.classList.remove('dragging'));
  card.addEventListener('dragover', e => { e.preventDefault(); card.classList.add('drag-over'); });
  card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
  card.addEventListener('drop', e => {
    e.preventDefault();
    card.classList.remove('drag-over');
    const from = Number(e.dataTransfer.getData('text/plain'));
    const to = i;
    if (from !== to) reorderCards(from, to);
  });

  const type = [...card.classList].find(c => c.startsWith('card--'))?.slice(6);
  const menu = document.createElement('div');
  menu.className = 'card__typeMenu';
  menu.innerHTML = `<select>${TYPE_OPTIONS.map(o => `<option value="${o}"${o === type ? ' selected' : ''}>${o}</option>`).join('')}</select>`;
  menu.querySelector('select').addEventListener('change', e => changeCardType(i, e.target.value));
  card.appendChild(menu);
}

async function save() {
  await fetch('/save', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: $editor.value });
  $status.textContent = '저장됨 · ' + new Date().toLocaleTimeString();
}

async function exportPngs() {
  $exportBtn.disabled = true;
  $status.textContent = 'PNG 생성 중…';
  try {
    const res = await fetch('/export', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: $editor.value });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    $status.textContent = `완료: ${data.count}장 → ${data.pngDir}`;
  } catch (err) {
    $status.textContent = '에러: ' + err.message;
  } finally {
    $exportBtn.disabled = false;
  }
}

async function shutdown() {
  await fetch('/shutdown', { method: 'POST' });
  document.body.innerHTML = '<div style="padding:40px;font-size:18px">에디터 종료됨. 창을 닫아도 됩니다.</div>';
}

function splitCards(md) {
  const fmMatch = md.match(/^---\n[\s\S]*?\n---\n?/);
  const head = fmMatch ? fmMatch[0] : '';
  const body = fmMatch ? md.slice(fmMatch[0].length) : md;
  const parts = body.split(/^---\s*$/m).map(p => p.trim());
  return { head, parts };
}

function joinCards(head, parts) {
  const sep = '\n\n---\n\n';
  const trimmedHead = head.replace(/\n+$/, '');
  const headSep = trimmedHead ? trimmedHead + '\n\n' : '';
  return headSep + parts.join(sep) + '\n';
}

function reorderCards(from, to) {
  const { head, parts } = splitCards($editor.value);
  const moved = parts.splice(from, 1)[0];
  parts.splice(to, 0, moved);
  $editor.value = joinCards(head, parts);
  rerender(); save();
}

function changeCardType(i, newType) {
  const { head, parts } = splitCards($editor.value);
  const cleaned = parts[i].replace(/<!--\s*card:\s*\w+\s*-->\n?/g, '').trim();
  const total = parts.length;
  const naturalType =
    i === 0 ? 'cover' :
    i === total - 1 && total > 1 ? 'cta' :
    'body';
  const needsMarker = newType !== naturalType;
  parts[i] = needsMarker ? `<!-- card: ${newType} -->\n${cleaned}` : cleaned;
  $editor.value = joinCards(head, parts);
  rerender(); save();
}

function updateFrontmatterKey(md, key, value) {
  const re = new RegExp(`^${key}:\\s*.*$`, 'm');
  if (/^---\n[\s\S]*?\n---/.test(md)) {
    if (re.test(md)) return md.replace(re, `${key}: ${value}`);
    return md.replace(/^---\n/, `---\n${key}: ${value}\n`);
  }
  return `---\n${key}: ${value}\n---\n\n${md}`;
}

function syncThemeFromSource() {
  const m = $editor.value.match(/^theme:\s*(\w+)/m);
  if (m) $theme.value = m[1];
}

bootstrap();
