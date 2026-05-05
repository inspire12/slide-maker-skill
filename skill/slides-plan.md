---
name: slides-plan
description: Analyze and validate markdown input for slide creation. Preprocessing, structure validation, and enhancement suggestions.
---

# Slides Plan

입력 파일을 분석하고, 슬라이드 구조를 검증하고, 개선점을 제안합니다.

## Trigger

`/slides-plan <file-path>` — accepts `.md`, `.pdf`, `.pptx`, `.png`, `.jpg` files.

## Phase 0 — Input Preprocessing

If the input is NOT a `.md` file, convert it to markdown first:

| Format | Method |
|--------|--------|
| `.md` | Skip to Phase 1 |
| `.pdf` | Use Read tool to extract content → convert to slide markdown with `#` chapters and `---` separators |
| `.pptx` | Use Read tool to extract slides → convert to slide markdown with `#` chapters and `---` separators |
| `.png`, `.jpg`, `.jpeg` | Use Read tool to recognize image content → convert to slide markdown |

After conversion, show the generated markdown to the user and ask for confirmation before proceeding.

## Phase 0.5 — Source Synthesis

주제, loose notes, 이미지, Obsidian 노트에서 시작할 때는 슬라이드별 설계 전에 자료를 정규화한다.

1. 대상, 강의 시간, 톤, 원하는 장수, 이미지 생성 기대치를 확인하거나 보수적으로 추정한다.
2. 사용한 문서, 링크, 이미지, 섹션을 챕터별 source map으로 기록한다.
3. Obsidian 문법을 일반 마크다운으로 변환한다:
   - frontmatter의 `title`, `summary`, `aliases`, `tags`를 힌트로 사용
   - `[[Note|Label]]`은 `Label`로, `[[Note]]`는 읽기 좋은 텍스트로 변환
   - `![[image.png]]`와 `![](image.png)`는 원본 파일 기준으로 해석
   - `> [!note]`, `> [!warning]` 등은 콜아웃 또는 발표 노트로 변환
4. 이미지별 파일명, 주제, 비율, 후보 슬라이드를 정리한다.
5. 최종 md 작성 전에 챕터별 story arc를 제안한다.

## Phase 1 — Validation

Read the markdown and check:

1. **Structure check:** Are `#` (chapters) and `---` (slide separators) used correctly?
2. **Empty slides:** Any slides with no content between separators?
3. **Missing titles:** Any content slides without a heading (`## title`)?
4. **Code blocks:** Any code blocks missing a language identifier?
5. **Image paths:** Do local image paths exist? (Use Glob to verify)

Report all findings to the user as a numbered list.

## Phase 1.5 — Per-Slide Planning

최종 markdown을 쓰기 전에 각 슬라이드를 아래 카드로 먼저 설계한다.

```markdown
### Slide N: Working title
- purpose: 청중이 이해해야 하는 한 문장
- key message: 화면에서 가장 크게 남길 주장/키워드
- source material: 사용한 메모, 문서 페이지, 링크, 이미지 파일
- visual: 이미지 경로, 생성/검색 필요 이미지, 다이어그램, 없음
- layout: basic / split-image / quote / stat-card / timeline / code-heavy / keyword
- visual budget: 16:9 fit risk, long Korean text, tall images, or code length
- speaker note: 화면 밖에서 말로 설명할 내용
- review focus: 사용자가 확인해야 할 부분
```

이 카드는 과밀 슬라이드 분리, 이미지 배치, 피드백 반복을 쉽게 하기 위한 중간 산출물이다.

## Phase 2 — Enhancement Suggestions

Analyze each slide and suggest improvements:

1. **Content overload:** If a slide has more than ~8 bullet points or ~200 words, suggest splitting.
2. **Key points:** Suggest summarizing dense paragraphs into bullet points.
3. **Speaker notes:** For slides without `> Note:` blocks, suggest auto-generated speaker notes.
4. **Summary slides:** For each chapter with 3+ content slides, suggest adding a summary slide at the end with key takeaways (3~5 bullet points).
5. **Feedback targets:** For unclear claims, image choices, or examples, mark the exact slide number and `review focus`.

Present suggestions to the user. Apply only the ones they approve.

## Output

Plan phase가 완료되면 사용자에게 보고:

- 검증 결과 (통과/실패 항목)
- 개선 제안 목록
- 승인된 변경사항 적용 후 최종 마크다운

다음 단계: `/slides-design <file-path>` 로 디자인 강화 진행

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
