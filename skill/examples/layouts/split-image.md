---
title: 이미지 분할 레이아웃 예시
author: Example
---

# 이미지 레이아웃

## 가로 이미지 — 좌우 분할

- 텍스트는 왼쪽에 배치
- 이미지는 오른쪽에 배치
- 가로 이미지(width ≥ height)일 때 자동 적용

![가로 이미지](images/landscape.png)

> Note: slide-split 레이아웃. split-text(왼쪽) + split-image(오른쪽) 구조.

---

## 세로 이미지 — 포트레이트 분할

- 세로 이미지(height > width)일 때 자동 적용
- 이미지가 왼쪽 45%
- 제목 + 텍스트가 오른쪽 55%

![세로 이미지](images/portrait.png)

> Note: portrait-split 레이아웃. slide-split-portrait 구조로 변환됨.

---

## 이미지 없는 슬라이드

- 이미지가 없으면 단일 컬럼
- slide-content 영역을 전체 사용
- 텍스트에 집중하는 슬라이드에 적합
