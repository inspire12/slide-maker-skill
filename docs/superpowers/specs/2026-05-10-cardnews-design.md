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
 입력 검증                브라우저 편집기 UI         HTML + PNG 생성
 카드 종류 식별           (분할화면, 드래그,         Playwright 캡처
 카드 수 권장             종류·테마 변경)            최종 산출물
                          PNG 내보내기 트리거도 가능
```

### Step 1 — Plan
- 마크다운 파싱 → 카드 분리
- 카드 종류 자동 식별 (cover/body/cta) + 마커 인식 (stat/quote)
- 카드 수 검토 (5~10장 권장, 초과/미달 시 권고)
- 빈 카드 / 너무 긴 본문 / 누락된 frontmatter 경고
- 사용자 승인 후 다음 단계로

### Step 2 — Design (Visual Editor UI)
**브라우저 기반 시각 편집기**. CLI가 로컬 Node 서버를 띄우고 브라우저를 열어 사용자가 직접 콘텐츠를 수정한다.

- `/cardnews-design <md>` 실행 → 로컬 Node 서버 시작 → 기본 브라우저로 `http://localhost:<port>` 자동 오픈
- 사용자가 UI에서 편집 → 자동저장(POST `/save`)으로 원본 `.md` 갱신
- 사용자가 "완료" 클릭 → 서버 종료, 다음 단계(export)로 진행 가능
- "PNG 내보내기" 클릭 시 서버가 직접 Playwright 호출 → export 단계까지 UI 안에서 완결 가능

#### UI 레이아웃 (분할화면)
- **좌측**: 마크다운 에디터 (모노스페이스, 신택스 하이라이트)
- **우측**: 카드별 실시간 렌더링 (스크롤 가능, 1080×1350 축소 미리보기)
- 입력 → debounce(300ms) → 우측 즉시 반영 + 백엔드 자동저장

#### UI 기능
1. **분할 편집** — 좌측 .md 편집 ↔ 우측 카드 미리보기 동기화
2. **카드 드래그 재정렬** — 우측 카드 썸네일을 드래그해 순서 변경 → 좌측 .md의 카드 블록 순서도 자동 재정렬
3. **카드 종류 변경 드롭다운** — 카드 위 드롭다운으로 cover/body/stat/quote/cta 변경 → 해당 카드 블록의 `<!-- card: ... -->` 마커 자동 삽입/제거
4. **색 테마 선택기** — 전역 또는 카드별 배경/강조색 토글 → frontmatter의 `theme` 또는 카드별 `<!-- card: stat color=warm -->` 형식으로 저장
5. **PNG 내보내기 버튼** — UI 안에서 export 트리거 (서버가 Playwright 호출, 진행률 표시, 완료 시 결과 경로 안내). 서버는 계속 떠 있어 추가 편집·재내보내기 가능
6. **완료 버튼** — 서버 종료, CLI로 복귀

#### Frontmatter 확장
| 키 | 용도 |
|----|------|
| `theme` | 전역 테마 프리셋 이름 (예: `mono`, `warm`, `bold`). UI 색 선택기로 변경 |

### Step 3 — Export
- 최종 `preview.html` 생성 (모든 카드 N개를 한 페이지에 4:5 캔버스로 렌더)
- Playwright로 각 `.card` 요소를 1080×1350 element screenshot
- `card_01.png` ~ `card_NN.png` 저장
- 사용자에게 결과물 경로 + 인스타 업로드 안내

### PNG 익스포트
- 도구: Playwright (Node) — 이미 설치됨
- 스크립트: `skill/cardnews/export.mjs`
- 동작: `preview.html`을 1080×1350 viewport로 열어 각 `.card[data-index]`를 element screenshot
- 호출 경로 2가지:
  1. CLI: 스킬이 `node skill/cardnews/export.mjs <html> <out-dir>` 직접 실행
  2. UI: 편집기의 "PNG 내보내기" 버튼 → 서버가 같은 스크립트를 자식 프로세스로 실행

### Visual Editor Server (design 단계 전용)
- 도구: Node `http` 또는 작은 Express 서버
- 스크립트: `skill/cardnews/server.mjs`
- 라이프사이클:
  1. 스킬이 `node skill/cardnews/server.mjs <md-path>` 실행
  2. OS 할당 포트(port 0)로 바인딩, 시작 시 stdout에 실제 URL 출력
  3. 사용자 기본 브라우저 자동 오픈
  4. 사용자가 "완료" 클릭 → POST `/shutdown` → 서버 종료
- 엔드포인트:
  | 경로 | 메서드 | 용도 |
  |------|--------|------|
  | `/` | GET | 에디터 HTML (분할화면) |
  | `/source` | GET | 현재 `.md` 원본 |
  | `/save` | POST | `.md` 덮어쓰기 (debounce 자동저장) |
  | `/render` | POST | 마크다운 → 카드 HTML 렌더링 (좌측 입력 → 우측 갱신) |
  | `/export` | POST | Playwright export 트리거, 진행률 SSE |
  | `/shutdown` | POST | 서버 정상 종료 |
- 보안: localhost only 바인딩, CORS 차단

## 디렉토리 구조

```
skill/cardnews/
  skill.md                  # 풀 파이프라인 진입점
  cardnews-plan.md          # plan 단계
  cardnews-design.md        # design 단계 (서버 기동)
  cardnews-export.md        # export 단계
  template.html             # 카드뉴스 전용 HTML 템플릿 (export용)
  export.mjs                # Playwright PNG 변환 스크립트
  server.mjs                # design 단계 로컬 서버
  editor/                   # 시각 편집기 UI 자산
    index.html              # 분할화면 에디터 (좌 .md / 우 카드)
    editor.css
    editor.js               # debounce 자동저장, 드래그 재정렬, 드롭다운, 테마, export 호출
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
- **로컬 의존성 최소**: Playwright 외 추가 설치 없음. 서버는 Node 내장 `http`로 구현, 에디터 UI는 vanilla JS + CDN (Pretendard 등)
- **명령 일관성**: `/slides` 스킬의 트리거 명명·승인 흐름과 대칭

## 명시적 비범위 (NOT in scope)

- 강의 .md → 카드뉴스 자동 변환 (별도 .md 작성 방식 채택)
- 1:1 / 9:16 비율 지원 (4:5만)
- PDF 단일 파일 출력
- 슬라이드 템플릿 재사용 / 색·폰트 공유
- 자동 SNS 업로드

## 다음 단계

이 spec 검토 완료 후 → `writing-plans` 스킬로 구현 계획(plan) 작성.
