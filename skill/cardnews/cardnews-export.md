---
name: cardnews-export
description: 카드뉴스 최종 PNG 익스포트. design 단계 결과물을 PNG 세트로 변환.
---

# Cardnews — Export

`/cardnews-export <md-path>` 트리거.

## 동작

1. 출력 디렉토리: `cardnews/<topic>/`
2. `.md`를 파싱·렌더해 `cardnews/<topic>/preview.html` 작성:

   ```bash
   node -e "
   import('./skill/cardnews/parser.mjs').then(async ({parseMarkdown}) => {
     const { renderDocument } = await import('./skill/cardnews/renderer.mjs');
     const fs = await import('node:fs');
     const md = fs.readFileSync('<md-path>', 'utf8');
     fs.mkdirSync('cardnews/<topic>', { recursive: true });
     fs.writeFileSync('cardnews/<topic>/preview.html', renderDocument(parseMarkdown(md)));
   });
   "
   ```

3. Playwright로 PNG 캡처:

   ```bash
   node skill/cardnews/export.mjs cardnews/<topic>/preview.html cardnews/<topic>/png
   ```

4. 사용자에게 결과 안내:
   - 카드 수
   - PNG 경로 (`cardnews/<topic>/png/card_01.png` ~ `card_NN.png`)
   - 인스타그램 업로드 안내 ("4:5 비율, 1080×1350px, 그대로 업로드 가능")

## 재실행

같은 `.md`로 다시 실행하면 같은 PNG가 나온다 (랜덤·타임스탬프 없음).
