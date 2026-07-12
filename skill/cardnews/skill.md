---
name: cardnews
description: Convert markdown to Instagram-ready card news (4:5, 1080×1350 PNG set). Use when the user wants to create card news, 카드뉴스, or visual marketing cards from markdown.
---

# Cardnews

마크다운 입력을 인스타그램용 카드뉴스(4:5, PNG 세트)로 변환한다.
3단계 파이프라인: plan → design(브라우저 시각 편집기) → export.

## Trigger

`/cardnews <md-path>` — 풀 파이프라인 (plan → design → export 순차 실행)

개별 단계도 실행 가능:
- `/cardnews-plan <md-path>` — 구조 검증
- `/cardnews-design <md-path>` — 브라우저 편집기 (자동저장)
- `/cardnews-export <md-path>` — PNG 캡처

## Workflow (3-Phase Pipeline)

```
/cardnews-plan      →    /cardnews-design     →    /cardnews-export
 입력 검증                브라우저 편집기 UI         HTML + PNG 생성
 카드 종류 식별           (분할화면, 드래그,         Playwright 캡처
 카드 수 권장             종류·테마 변경)            최종 산출물
                          PNG 내보내기 트리거도 가능
```

각 단계 사이에 사용자 승인을 받는다. design 단계 안에서 "PNG 내보내기" 버튼을 누르면 export까지 한 번에 완료된다.

## Output

```
cardnews/<topic>/
  source.md (또는 원본 위치 유지)
  preview.html
  png/
    card_01.png … card_NN.png
```

## Markdown Syntax

```markdown
---
title: 카드뉴스 제목
brand: "@monymony"
cta: 팔로우 · 저장 · 공유
theme: mono   # mono | warm | cool | bold
---

# 후킹 한 줄          ← 자동: cover (첫 카드)

---

## 본문 카드          ← 자동: body
- 핵심 포인트

---

<!-- card: stat -->   ← 명시: 숫자 강조
**1,200%**
연간 성장률

---

<!-- card: quote -->  ← 명시: 인용
"한 줄 인용"
— 인용처

---

## 마지막 메시지       ← 자동: cta (마지막 카드)
```

### 카드 종류 (5종)

| 종류 | 트리거 | 레이아웃 |
|------|--------|---------|
| `cover` | 첫 카드 (자동) 또는 마커 | 큰 후킹 타이틀 + 브랜드 |
| `body` | 기본 (자동) | 제목 + 본문 |
| `stat` | `<!-- card: stat -->` | 큰 숫자 + 설명 |
| `quote` | `<!-- card: quote -->` | 따옴표 + 인용처 |
| `cta` | 마지막 카드 (자동) 또는 마커 | CTA 메시지 |

### 테마

| 테마 | 강조색 |
|------|--------|
| `mono` (기본) | #ff5a36 |
| `warm` | #f59e0b |
| `cool` | #2563eb |
| `bold` | #dc2626 |

## 예시

`skill/cardnews/examples/sample.md` 참고.
