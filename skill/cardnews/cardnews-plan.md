---
name: cardnews-plan
description: 카드뉴스 마크다운 입력을 검증하고 구조를 분석. /slides-plan과 대칭.
---

# Cardnews — Plan

`/cardnews-plan <md-path>` 트리거.

## 동작

1. 입력 `.md`를 `parseMarkdown`으로 파싱한다.
2. 다음 항목을 사용자에게 보고한다:
   - 총 카드 수 (5~10장 권장, 미만/초과 시 경고)
   - 각 카드의 자동 식별된 타입 (cover/body/stat/quote/cta)
   - 명시 마커가 있는 카드 위치
   - `frontmatter` 누락 키 (`title`, `brand`, `cta`, `theme`)
   - 빈 카드 / 너무 긴 본문 (300자 초과)
3. 개선 제안:
   - 본문이 길면 카드를 분리할지 제안
   - stat/quote에 적합한 카드가 body로 식별됐을 가능성 안내
4. 사용자 승인 후 `/cardnews-design`으로 진행할지 묻기.

## 실행 예

```bash
node -e "
(async () => {
  const { parseMarkdown } = await import('./skill/cardnews/parser.mjs');
  const fs = await import('node:fs');
  const md = fs.readFileSync(process.argv[1], 'utf8');
  const parsed = parseMarkdown(md);
  console.log(JSON.stringify({
    total: parsed.cards.length,
    types: parsed.cards.map(c => c.type),
    frontmatter: parsed.frontmatter,
  }, null, 2));
})();
" <md-path>
```

스킬은 위 출력을 받아 사람이 읽기 좋은 보고서로 변환.
