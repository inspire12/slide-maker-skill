// skill/cardnews/parser.mjs
import yaml from 'js-yaml';

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?/;
const CARD_TYPE_RE = /<!--\s*card:\s*(cover|body|stat|quote|cta)\s*-->/;

export function parseMarkdown(input) {
  let body = input;
  let frontmatter = {};

  const fm = input.match(FRONTMATTER_RE);
  if (fm) {
    frontmatter = yaml.load(fm[1]) || {};
    body = input.slice(fm[0].length);
  }

  const rawCards = body.split(/^---\s*$/m).map(s => s.trim()).filter(Boolean);
  const cards = rawCards.map((raw, i) => {
    const content = raw
      .split('\n')
      .filter(line => !/^>\s*Note:/.test(line))
      .join('\n')
      .trim();

    const markerMatch = content.match(CARD_TYPE_RE);
    let type;
    if (markerMatch) {
      type = markerMatch[1];
    } else if (i === 0 && /^#\s/.test(content)) {
      type = 'cover';
    } else if (i === rawCards.length - 1 && rawCards.length > 1) {
      type = 'cta';
    } else {
      type = 'body';
    }

    const cleanContent = content.replace(CARD_TYPE_RE, '').trim();
    return { type, raw: cleanContent, index: i };
  });

  return { frontmatter, cards };
}
