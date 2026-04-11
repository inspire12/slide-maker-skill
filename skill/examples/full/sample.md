---
title: Markdown to Slide 종합 쇼케이스
author: Demo User
---

# 1장. 소개

환영합니다! 이 프레젠테이션은 **모든 레이아웃**을 한눈에 보여주는 종합 쇼케이스입니다.

> Note: 첫 번째 챕터의 첫 슬라이드입니다. 발표자 노트는 N 키로 토글할 수 있습니다.

---

## 주요 기능

- 🚀 **10가지 레이아웃** — 다양한 슬라이드 구조 지원
- 📝 **마크다운 기반** — 별도 도구 없이 텍스트로 작성
- 🎨 **자동 디자인** — stat-card, callout, 키워드 자동 변환
- ⌨️ **키보드 내비게이션** — 슬라이드/챕터 이동, 전체화면

> Note: icon-grid 레이아웃. 이모지 + 볼드 키워드 + 설명 패턴.

---

## 이미지 분할 레이아웃

- 가로 이미지는 텍스트 왼쪽 + 이미지 오른쪽
- 세로 이미지는 portrait 레이아웃 자동 적용
- 이미지 없으면 단일 컬럼

![샘플 이미지](https://via.placeholder.com/600x300/e5e5e7/1d1d1f?text=Split+Layout)

> Note: split-image 레이아웃. 가로 이미지이므로 좌우 분할로 렌더링됨.

# 2장. 숫자와 강조

!!!데이터가 답이다

---

## 핵심 성과 지표

**95%** 고객 만족도

**1,200만원** 월간 매출

**3.2초** 평균 응답 시간

> Note: stat-card 레이아웃. 볼드 숫자 + 설명이 큰 폰트 카드로 변환됨.

---

## Before vs After

**Before:** 수동 배포, 평균 **2시간** 소요

**After:** CI/CD 파이프라인, 평균 **5분** 소요

> 95% 시간 단축 달성

> Note: comparison 레이아웃. stat-card + callout 조합으로 전후 비교.

---

## 기술 스택 비교

| 항목 | 현재 | 목표 |
|------|------|------|
| 아키텍처 | Monolith | MSA |
| DB | MySQL 단일 | MySQL + Redis + MongoDB |
| 배포 | 수동 | GitOps 자동 |
| 모니터링 | 없음 | Grafana + Prometheus |

> Note: comparison 레이아웃 (테이블 형태). 의사결정 슬라이드에서 자주 사용.

# 3장. 타임라인과 인용

## 프로젝트 로드맵

- **Q1** — 요구사항 분석 및 설계
- **Q2** — MVP 개발 및 내부 테스트
- **Q3** — 베타 출시 및 피드백 수집
- **Q4** — 정식 런칭

> Note: timeline 레이아웃. 볼드 키워드 + 설명 패턴으로 단계별 진행 표현.

---

## 고객의 목소리

> "이 서비스를 쓰고 나서 업무 시간이 절반으로 줄었습니다."

— 김철수, ABC 기업 팀장

> Note: quote 레이아웃. blockquote가 callout 스타일로 렌더링됨.

---

## 데이터가 말하는 것

> "사용자의 68%가 3초 이내에 로딩되지 않으면 이탈한다."

— Google Web Performance Report, 2024

**3초** 골든 타임

> Note: quote + stat-card 조합. 인용구와 숫자 강조를 함께 사용.

# 4장. 코드 예시

코드 블록은 자동으로 구문 하이라이팅됩니다.

---

## 하이라이트가 있는 코드

```javascript {highlight: 3-5}
// api/handler.js
export async function handler(req, res) {
  const data = await fetchData(req.query.id);  // highlighted
  const result = transform(data);               // highlighted
  res.json({ success: true, result });           // highlighted
}
```

> Note: code-heavy 레이아웃. 파일명 타이틀 + 하이라이트 라인 + 언어 뱃지.

---

## 코드 + 설명 조합

핵심 로직:

```python
def process(items: list[Item]) -> list[Result]:
    return [item.transform() for item in items]
```

- `transform()` 메서드가 핵심 변환 담당
- 리스트 컴프리헨션으로 간결하게 표현

> Note: 코드와 불릿 설명을 함께 배치하는 패턴.

# 5장. 마무리

## 요약

- 핵심 메시지 1: 속도가 경쟁력이다
- 핵심 메시지 2: 데이터 기반 의사결정
- 핵심 메시지 3: 작게 시작하고 빠르게 반복

> Note: closing 레이아웃. 발표 내용을 3줄로 정리.

---

## 감사합니다

> "함께 만들어가는 더 나은 서비스"

- 📧 email@example.com
- 🐙 github.com/username

> Note: closing 레이아웃. 인용구 + 연락처로 마무리.
