---
name: slides-design
description: Apply visual design enhancements to validated slide markdown. Content visibility, image matching, and layout decisions.
---

# Slides Design

검증 완료된 마크다운에 디자인 강화를 적용합니다.

## Trigger

`/slides-design <file-path>` — plan 단계를 거친 `.md` 파일 대상.

## Phase 2.1 — Content Visibility Enhancement

Automatically apply the following visibility improvements during HTML generation:

1. **Keyword auto-highlight:** Identify 1~3 key terms per slide and wrap them with `<strong class="keyword">`. Target: numbers/statistics, technical terms, action verbs.
2. **Stat card layout:** When a slide contains a standalone number or statistic (e.g., `**95%**`, `**1,200만원**`), render it as a `.stat-card` with large font and accent color.
3. **Blockquote styling:** Render `>` blockquotes (not `> Note:`) as visually distinct callout boxes with left accent border and background.
4. **Auto font scaling:** If slide content exceeds estimated visible area (~8 bullet points or ~250 words), reduce `font-size` by applying `.dense-content` class to prevent overflow.
5. **List icon hints:** If a bullet item starts with an emoji, keep it. Otherwise, apply default styled bullets via CSS.

## Phase 2.5 — Image Auto-Matching

If an `images/` directory exists in the same directory as the input file (e.g., `slides/images/`):

1. **Scan images:** Use Glob to find all images in the directory (`images/*.{png,jpg,jpeg,gif,svg}`)
2. **Recognize content:** Use Read tool to view each image and understand what it contains
3. **Match to slides:** For each slide, determine if any image is relevant based on:
   - Slide title and content keywords
   - Image content/subject matter
   - Visual appropriateness for the slide topic
4. **Suggest placements:** Present a mapping to the user:
   ```
   슬라이드 "양자컴퓨터 버블 붕괴" ← images/quantum_crash.png
   슬라이드 "수익 곡선" ← images/profit_chart.png
   슬라이드 "1년 항해 계획" ← (매칭 이미지 없음)
   ```
5. **Apply approved matches:** Insert `![](images/filename)` into the approved slides

If no `images/` directory exists, skip this phase.

## Layout Decision Guide

이미지가 포함된 슬라이드의 레이아웃은 이미지 비율에 따라 자동 결정:

| 이미지 비율 | 레이아웃 | 설명 |
|---|---|---|
| 가로 ≥ 세로 | `slide-split` | 텍스트 왼쪽 + 이미지 오른쪽 |
| 세로 > 가로 | `portrait-split` | 이미지 왼쪽 45% + 텍스트 오른쪽 55% |
| 이미지 없음 | 단일 컬럼 | `slide-content` 전체 사용 |

## Output

Design phase가 완료되면 사용자에게 보고:

- 적용된 디자인 강화 항목
- 이미지 매칭 결과
- 레이아웃 결정 요약

다음 단계: `/slides-export <file-path>` 로 HTML 생성 진행
