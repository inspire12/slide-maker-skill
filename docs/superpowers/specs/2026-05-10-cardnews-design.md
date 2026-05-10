# Cardnews — Design Spec

## 개요

기존 `/slides` 스킬과 별개로, **인스타그램 마케팅용 카드뉴스**를 만드는 Claude Code skill.
카드뉴스 전용 마크다운(`.md`)을 입력받아 HTML 미리보기 + PNG 카드 세트(1080×1350, 4:5)로 변환한다.
기존 강의 슬라이드 워크플로우와 **분리된 신규 디자인 시스템**으로 마케팅 톤을 살린다.

## 요구사항

- **목적**: 인스타그램 피드용 카드뉴스 (강의 후 SNS 공유 + 사전 홍보 + 핵심 요약 겸용, 1차 채널은 인스타그램)
- **입력**: 카드뉴스 전용 마크다운 (강의 .md와 분리, 수동 작성)
- **출력**: HTML 미리보기 1개 + PNG 카드 N개 (1080×1350)
- **디자인**: 슬라이드 템플릿과 분리된 카드뉴스 전용 새 디자인 시스템 (굵은 타이포, 큰 사이즈, 마케팅 톤)
- **실행 흐름**: `/slides`와 대칭되는 3단계 (plan → design → export)
- **렌더 엔진**: Playwright (이미 시스템에 설치됨, Node 22.21.1)

## 트리거

- `/cardnews <md>` — 풀 파이프라인 (plan → design → export 순차)
- `/cardnews-plan <md>` — 1단계만
- `/cardnews-design <md>` — 2단계만
- `/cardnews-export <md>` — 3단계만 (최종 PNG 익스포트)

각 단계 사이에 사용자 승인을 받는다.

## 마크다운 문법 (혼합 방식)

자동 인식을 기본으로 하되, 카드 종류를 강조하고 싶을 때만 명시 마커를 쓴다.

### 기본 구조

```markdown
---
title: 카드뉴스 제목
brand: "@monymony"
cta: 팔로우 · 저장 · 공유
---

# 후킹 한 줄                        ← 자동: cover (첫 카드, # 한 개)

> Note: PNG에 안 들어가는 메모

---

## 본문 카드                         ← 자동: body
- 핵심 포인트
- 또 하나

---

<!-- card: stat -->                 ← 명시: 숫자 강조
**1,200%**
연간 성장률

---

<!-- card: quote -->                ← 명시: 인용
"한 줄 인용"
— 인용처

---

## 마지막 메시지                     ← 자동: cta (마지막 카드)
저장하고 다시 보세요
```

### 카드 종류 (5종)

| 종류 | 트리거 | 레이아웃 |
|------|--------|----------|
| `cover` | 첫 카드 (자동) 또는 `<!-- card: cover -->` | 큰 후킹 타이틀 + 브랜드 핸들 |
| `body` | 기본 (자동) | 제목 + 본문 (불릿/단락) |
| `stat` | `<!-- card: stat -->` | 큰 숫자 + 짧은 설명 |
| `quote` | `<!-- card: quote -->` | 큰 따옴표 + 인용처 |
| `cta` | 마지막 카드 (자동) 또는 `<!-- card: cta -->` | 행동 유도 메시지 + CTA 텍스트 |

### Frontmatter

| 키 | 용도 |
|----|------|
| `title` | 메타 / preview.html `<title>` |
| `brand` | 카드 우측 상단 등에 노출되는 브랜드 핸들 (생략 시 비표시) |
| `cta` | 마지막 cta 카드의 기본 CTA 텍스트 (생략 시 본문 마지막 줄 사용) |

### 규칙

- `---`로 카드 구분 (frontmatter는 첫 `---`로 둘러쌈)
- `> Note:`는 PNG에 렌더되지 않음 (제작 메모용)
- 페이지네이션 (`2/7` 등)은 모든 카드에 자동 표시
- 권장 카드 수: 5~10장 (plan 단계에서 검증)

## 디자인 시스템 (전용)

### 캔버스
- 1080 × 1350 px (4:5 세로)
- safe area: 상하좌우 80px 패딩

### 타이포그래피
- 본문 폰트: **Pretendard** (한글 가독성 + 굵직한 인상)
- 카드별 타이틀 사이즈는 카드 종류에 따라 차등 (cover/stat은 크게)
- font-weight 700~900 위주로 사용

### 색상
- 단일 강조색 + 배경 변주 (예: 흰 배경, 검정 배경, 강조색 배경)
- 카드 종류별 또는 순서별로 색 변주를 자동 결정 (디자인 단계에서 제안 후 확정)

### 공통 요소
- 우상단: 브랜드 핸들 (`brand` frontmatter)
- 우하단: 페이지네이션 (`2/7`)
- 강조 키워드는 색상 또는 굵기로 처리

## 아키텍처

### 3단계 파이프라인

```
/cardnews-plan      →    /cardnews-design     →    /cardnews-export
 입력 검증                레이아웃 매칭               HTML + PNG 생성
 카드 종류 식별           색 변주 결정               Playwright 캡처
 카드 수 권장             미리보기 HTML 가안          최종 산출물
```

### Step 1 — Plan
- 마크다운 파싱 → 카드 분리
- 카드 종류 자동 식별 (cover/body/cta) + 마커 인식 (stat/quote)
- 카드 수 검토 (5~10장 권장, 초과/미달 시 권고)
- 빈 카드 / 너무 긴 본문 / 누락된 frontmatter 경고
- 사용자 승인 후 다음 단계로

### Step 2 — Design
- 카드별 레이아웃 매칭 (cover/body/stat/quote/cta)
- 카드 순서 기반 색 변주 결정 (예: 흰→강조색→흰→검정→…)
- 강조 키워드 추출 제안 (선택)
- 미리보기 HTML 가안 생성 → 사용자가 브라우저로 확인
- 사용자 승인 후 다음 단계로

### Step 3 — Export
- 최종 `preview.html` 생성 (모든 카드 N개를 한 페이지에 4:5 캔버스로 렌더)
- Playwright로 각 `.card` 요소를 1080×1350 element screenshot
- `card_01.png` ~ `card_NN.png` 저장
- 사용자에게 결과물 경로 + 인스타 업로드 안내

### PNG 익스포트
- 도구: Playwright (Node) — 이미 설치됨
- 스크립트: `skill/cardnews/export.mjs`
- 동작: `preview.html`을 1080×1350 viewport로 열어 각 `.card[data-index]`를 element screenshot
- 호출: 스킬이 직접 `node skill/cardnews/export.mjs <html> <out-dir>` 실행

## 디렉토리 구조

```
skill/cardnews/
  skill.md                  # 풀 파이프라인 진입점
  cardnews-plan.md          # plan 단계
  cardnews-design.md        # design 단계
  cardnews-export.md        # export 단계
  template.html             # 카드뉴스 전용 HTML 템플릿
  export.mjs                # Playwright PNG 변환 스크립트
  examples/
    sample.md               # 카드뉴스 예시 마크다운
    sample.html             # 예시 결과 미리보기

cardnews/                   # 결과물 디렉토리 (gitignore 여부는 추후 결정)
  <topic>/
    source.md               # 입력 .md 사본
    preview.html            # HTML 미리보기
    png/
      card_01.png
      card_02.png
      ...
```

## 비기능 요구사항

- **재실행 가능성**: 같은 .md를 다시 export하면 동일 PNG가 나와야 함 (랜덤 요소·타임스탬프 사용 금지)
- **로컬 의존성 최소**: Playwright 외 추가 설치 없음 (Pretendard는 CDN 또는 로컬 폰트)
- **명령 일관성**: `/slides` 스킬의 트리거 명명·승인 흐름과 대칭

## 명시적 비범위 (NOT in scope)

- 강의 .md → 카드뉴스 자동 변환 (별도 .md 작성 방식 채택)
- 1:1 / 9:16 비율 지원 (4:5만)
- PDF 단일 파일 출력
- 슬라이드 템플릿 재사용 / 색·폰트 공유
- 자동 SNS 업로드

## 다음 단계

이 spec 검토 완료 후 → `writing-plans` 스킬로 구현 계획(plan) 작성.
