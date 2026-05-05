---
name: slides-feedback
description: Track slide review comments and apply approved changes while keeping markdown as the source of truth.
---

# Slides Feedback

생성된 HTML을 리뷰한 뒤 반복 수정할 때 사용한다.

## Feedback Memo

원본 md 옆에 feedback memo를 만든다.

```text
<deck-name>.feedback.md
```

단일 원본 md가 없다면 아래 경로를 사용한다.

```text
feedback/<deck-name>.md
```

권장 형식:

```markdown
# Feedback: Deck Title

## Round 1 - YYYY-MM-DD

### Slide 3 - Working title
- request: 사용자가 바꾸고 싶은 내용
- decision: accepted / rejected / needs confirmation
- source update: 수정할 markdown 섹션 또는 이미지 경로
- status: todo / done
```

## Rules

1. 승인된 콘텐츠 변경은 `.md`에 먼저 반영하고 HTML을 재생성한다.
2. 런타임/스타일 변경은 template 또는 HTML 생성 규칙에 반영한다.
3. `annotated-*.html`은 수정 원본이 아니라 강의 기록용 고정 복사본이다.
4. 슬라이드 번호가 바뀌면 새 round를 시작하고 번호 변경을 메모한다.
5. 완료 항목에는 수정 파일과 재생성된 HTML 경로를 기록한다.

## Output

- 변경한 feedback round와 slide number
- 수정한 source 파일
- 재생성한 HTML 파일
- 남은 확인 항목
