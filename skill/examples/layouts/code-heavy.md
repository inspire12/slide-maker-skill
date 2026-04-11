---
title: 코드 중심 레이아웃 예시
author: Example
---

# 코드 슬라이드

## 기본 코드 블록

```python
def hello(name):
    return f"Hello, {name}!"
```

> Note: 언어 지정 시 자동으로 구문 하이라이팅 + 언어 뱃지 표시.

---

## 파일명 + 하이라이트

```javascript {highlight: 3-5}
// api/handler.js
export async function handler(req, res) {
  const data = await fetchData(req.query.id);  // highlighted
  const result = transform(data);               // highlighted
  res.json({ success: true, result });           // highlighted
}
```

> Note: 첫 줄 주석이 파일명 타이틀로 추출됨. highlight 지정된 줄은 강조 표시.

---

## 코드 + 설명 조합

핵심 로직:

```go
func Process(items []Item) []Result {
    results := make([]Result, 0, len(items))
    for _, item := range items {
        results = append(results, item.Transform())
    }
    return results
}
```

- `Transform()` 메서드가 핵심 변환 담당
- 슬라이스 사전 할당으로 메모리 효율화
