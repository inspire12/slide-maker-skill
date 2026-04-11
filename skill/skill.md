---
name: slides
description: Convert markdown (or PDF/PPTX/image) to a self-contained presentation HTML file. Use when the user wants to create slides, presentations, or decks from markdown content.
---

# Markdown to Slide

Convert input files into a self-contained HTML presentation with chapter/slide navigation, syntax highlighting, and speaker notes.

## Trigger

`/slides <file-path>` — accepts `.md`, `.pdf`, `.pptx`, `.png`, `.jpg` files.

Full pipeline: runs plan → design → export sequentially. For step-by-step control, use individual commands.

## Workflow (3-Phase Pipeline)

```
/slides-plan    →    /slides-design    →    /slides-export
 입력 분석             디자인 강화             HTML 생성
 구조 검증             이미지 매칭             QR 코드
 개선 제안             레이아웃 결정            최종 출력
```

### Step 1 — Plan (`/slides-plan`)

입력 파일을 분석하고 슬라이드 구조를 검증합니다.

- **Phase 0:** 입력 전처리 (PDF/PPTX/이미지 → 마크다운 변환)
- **Phase 1:** 구조 검증 (챕터/슬라이드 구분, 빈 슬라이드, 코드블록, 이미지 경로)
- **Phase 2:** 개선 제안 (콘텐츠 분할, 스피커 노트, 요약 슬라이드)

사용자 승인 후 다음 단계로 진행.

### Step 2 — Design (`/slides-design`)

검증된 마크다운에 디자인 강화를 적용합니다.

- **Phase 2.1:** 콘텐츠 가시성 강화 (키워드 하이라이트, stat-card, 콜아웃, 자동 폰트 스케일링, 반응형 폰트)
- **Phase 2.5:** 이미지 자동 매칭 (`images/` 디렉토리 스캔 → 슬라이드별 매칭 제안)
- **Layout:** 이미지 비율에 따른 레이아웃 자동 결정

사용자 승인 후 다음 단계로 진행.

### Step 3 — Export (`/slides-export`)

최종 HTML 프레젠테이션을 생성합니다.

- **Phase 3:** HTML 생성 (template.html 기반, 챕터/슬라이드/TOC/코드블록 등)
- **Phase 4:** QR 코드 슬라이드 (선택, `share_url` 지정 시)

## Full Pipeline Behavior

`/slides <file-path>` 실행 시:

1. Plan 단계 실행 → 검증 결과 및 개선 제안을 사용자에게 보고
2. 사용자 승인 후 Design 단계 실행 → 디자인 결과 보고
3. 사용자 승인 후 Export 단계 실행 → HTML 파일 생성

각 단계 사이에 사용자 확인을 거치므로, 원하는 시점에 수정 가능.

## Output

- Input: `./presentation.md` → Output: `./presentation.html`
- Tell the user: "Presentation saved to `{output_path}`. Open in a browser to present."
- Keyboard shortcuts:
  - `←` `→` — Navigate slides
  - `↑` `↓` — Navigate chapters
  - `F` — Fullscreen
  - `N` — Speaker notes
  - `T` — Table of contents
  - `Home` / `End` — First / last slide

## Source-of-truth policy — md ↔ HTML

- **원본은 항상 `.md` 파일**이다. HTML은 md로부터 생성된 결과물.
- 슬라이드 내용(텍스트 · 이미지 · 순서 · 챕터 구조)을 수정할 때는 **먼저 md를 수정**하고 빌드 스크립트로 HTML을 재생성한다.
- 디자인/스타일(CSS) 수정은 HTML(또는 `template.html`)에서만 하고 md는 손대지 않는다.
- **금지**: HTML에서 텍스트 · bullets · 이미지 경로만 고치고 md를 방치하는 것. 다음 재빌드 시 변경이 사라진다.
- **예외**: 긴급 hotfix로 HTML을 먼저 고친 경우, 같은 커밋에 md도 동일하게 반영해 drift가 남지 않도록 한다.

## Markdown Syntax Reference

```markdown
---
title: Presentation Title
author: Author Name
share_url: https://example.com/my-slides   ← (optional) adds QR code slide at the end
---

# Chapter Title        ← Creates chapter title slide

Content for first slide

> Note: Speaker notes go here.

---                     ← Slide separator (within chapter)

## Slide Title          ← Content slide with title

- Bullet points
- More content

# Next Chapter          ← New chapter starts
```

## Slide Structure Examples

### Basic slide (single column)
```markdown
## 슬라이드 제목

- 항목 1
- 항목 2
- 항목 3

> Note: 발표자 노트는 여기에
```

### Split layout (text + image)
```markdown
## 시장 분석

- 성장률 12% 달성
- 신규 고객 500명

![](images/market_chart.png)
```
→ 텍스트 왼쪽, 이미지 오른쪽 분할 레이아웃. 세로 이미지는 자동으로 portrait 레이아웃 적용.

### Stat card (big number emphasis)
```markdown
## 성과 요약

**95%** 고객 만족도

**1,200만원** 월 매출
```
→ 숫자가 큰 폰트 + 강조 색상으로 렌더링되는 stat-card

### Keyword slide (full-screen message)
```markdown
!!!핵심은 속도다
```
또는
```markdown
<!-- keyword: 핵심은 속도다 -->
```
→ 전체 화면 키워드 강조 슬라이드

### Callout blockquote
```markdown
## 주의사항

> 이 기능은 베타 버전입니다. 프로덕션 사용에 주의하세요.
```
→ 왼쪽 강조 보더 + 배경색이 있는 콜아웃 박스 (`> Note:`와 구분됨)

### Code block with highlights
````markdown
## 코드 예시

```python {highlight: 3-5}
# data_loader.py
def load_data(path):
    with open(path) as f:    # ← highlighted
        data = json.load(f)  # ← highlighted
        return data           # ← highlighted
```
````
→ 언어 뱃지 + 파일명 타이틀 + 하이라이트 라인 + 복사 버튼

### Chapter with summary
```markdown
# 1장. 문제 정의

## 현황
- 기존 시스템의 한계

---

## 원인 분석
- 레거시 아키텍처
- 확장성 부족

---

## 영향
- 운영 비용 증가
```
→ 3개 이상 슬라이드가 있는 챕터는 Plan 단계에서 요약 슬라이드 제안

### Complete example
```markdown
---
title: 서비스 성장 전략
author: 홍길동
share_url: https://example.com/slides
---

# 현황 분석

## 주요 지표

**250만** 월간 활성 사용자

**4.8** 앱스토어 평점

> Note: 지난 분기 대비 30% 성장했음을 강조

---

## 경쟁 환경

- 경쟁사 A: 시장 점유율 35%
- 경쟁사 B: 공격적 가격 정책

![](images/competition.png)

# 전략 제안

!!!고객 중심 혁신

---

## 3단계 로드맵

1. 핵심 기능 강화 (Q1)
2. 신규 시장 진출 (Q2)
3. 플랫폼 확장 (Q3-Q4)

> 단계별 투자 규모는 별도 문서를 참고하세요.

> Note: Q1은 이미 진행 중이며 70% 완료
```

## Reference Examples

레이아웃별 마크다운 예시와 완성된 발표 예시를 참조할 수 있습니다.

```
skill/examples/
├── layouts/              ← 레이아웃별 미니 예시 (마크다운만)
│   ├── basic.md          ← 단일 컬럼, 테이블, 순서 목록
│   ├── split-image.md    ← 가로/세로 이미지 분할 레이아웃
│   ├── stat-card.md      ← 숫자 강조 (stat-card)
│   ├── keyword.md        ← 전체화면 키워드 (!!! / <!-- keyword -->)
│   ├── code-heavy.md     ← 코드 블록 + 하이라이트 + 파일명
│   ├── timeline.md       ← 로드맵, 연혁, 단계별 진행
│   ├── comparison.md     ← A vs B, Before/After 비교
│   ├── quote.md          ← 인용구, 고객 후기, 핵심 발언
│   ├── icon-grid.md      ← 이모지 카드 그리드 (기능/역할/USP)
│   └── closing.md        ← 요약, Q&A, 감사 마무리
└── full/                 ← 완성된 발표 예시 (md + html 쌍)
    ├── sample.md
    └── sample.html
```

Plan 단계에서 사용자가 레이아웃을 고민할 때, 해당 예시 파일을 읽어서 보여줄 수 있습니다.

## Template Location

The HTML template is at: `~/.claude/skills/markdown-to-slide/template.html`

Read this template file and use it as the base for HTML generation. Replace the `{{TITLE}}` and `{{SLIDES}}` placeholders with generated content. The CSS and JS are already included in the template.
