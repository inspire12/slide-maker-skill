---
title: Markdown to Slide 데모
author: Demo User
---

# 1장. 소개

환영합니다! 이 프레젠테이션은 **Markdown to Slide** 데모입니다.

> Note: 첫 번째 챕터의 첫 슬라이드입니다. 발표자 노트는 N 키로 토글할 수 있습니다.

---

## 주요 기능

- 마크다운에서 HTML 슬라이드 자동 생성
- 챕터 / 슬라이드 2단계 구조
- 코드 구문 하이라이팅 + 라인 넘버
- 키보드 내비게이션
- 발표자 노트 지원

> Note: 기능 목록을 하나씩 설명해주세요.

---

## 이미지 지원

![샘플 이미지](https://via.placeholder.com/600x300/e5e5e7/1d1d1f?text=Sample+Image)

이미지는 마크다운 표준 문법으로 삽입합니다.

# 2장. 코드 예시

코드 블록은 자동으로 구문 하이라이팅됩니다.

---

## JavaScript 예시

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
```

> Note: 피보나치 함수를 예시로 보여줍니다. 재귀 구현입니다.

---

## Python 예시

```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))
```

# 3章. 마무리

## 키보드 단축키

| 키 | 동작 |
|-----|------|
| ← → | 슬라이드 이동 |
| ↑ ↓ | 챕터 이동 |
| F | 전체화면 |
| N | 발표자 노트 |
| T | 목차 |

---

## 감사합니다!

질문이 있으시면 편하게 말씀해주세요.

> Note: Q&A 시간. 준비한 답변 목록을 확인하세요.
