---
name: cardnews-design
description: 카드뉴스 디자인 단계 — 로컬 서버 + 브라우저 시각 편집기 기동.
---

# Cardnews — Design

`/cardnews-design <md-path>` 트리거.

## 동작

1. 출력 디렉토리 결정: `cardnews/<topic>/` (topic = .md 파일명 stem)
2. 로컬 서버 기동:

   ```bash
   node skill/cardnews/server.mjs <md-path> cardnews/<topic>/
   ```

3. 서버는 자동으로 기본 브라우저를 열어 분할화면 에디터를 표시한다.
4. 사용자가 편집기 안에서:
   - 좌측 .md 편집 → 우측 실시간 카드 미리보기 (자동저장)
   - 카드 드래그로 순서 변경
   - 카드별 드롭다운으로 타입 변경 (cover/body/stat/quote/cta)
   - 상단 theme 셀렉트로 색 변경
   - "PNG 내보내기" 버튼으로 export 트리거 (서버가 Playwright 호출)
   - "완료" 버튼으로 서버 종료
5. 서버 종료 후 `/cardnews-export`로 진행할지 묻기 (편집기에서 이미 export했다면 스킵 가능).

## 종료 조건

- 사용자가 "완료" 클릭 → 서버 정상 종료
- 또는 사용자가 Ctrl+C로 강제 종료
- 어느 쪽이든 .md는 자동저장으로 최신 상태 유지
