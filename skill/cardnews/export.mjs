// skill/cardnews/export.mjs
// Usage: node skill/cardnews/export.mjs <preview.html> <out-dir>
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const CARD_W = 1080;
const CARD_H = 1350;

export async function exportPngs(htmlPath, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: CARD_W, height: CARD_H },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto(pathToFileURL(path.resolve(htmlPath)).href);
  await page.waitForLoadState('networkidle');

  const cards = await page.$$('.card[data-index]');
  const results = [];
  for (const card of cards) {
    const idx = Number(await card.getAttribute('data-index'));
    const file = path.join(outDir, `card_${String(idx + 1).padStart(2, '0')}.png`);
    await card.screenshot({ path: file, omitBackground: false });
    results.push(file);
  }
  await browser.close();
  return results;
}

const isMain = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || '');
if (isMain) {
  const [, , htmlArg, outArg] = process.argv;
  if (!htmlArg || !outArg) {
    console.error('Usage: node export.mjs <preview.html> <out-dir>');
    process.exit(1);
  }
  exportPngs(htmlArg, outArg)
    .then(files => { console.log(`Exported ${files.length} cards to ${outArg}`); })
    .catch(err => { console.error(err); process.exit(1); });
}
