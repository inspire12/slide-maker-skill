---
name: slides-feedback
description: Track slide review comments and apply approved changes while keeping markdown as the source of truth.
---

# Slides Feedback

Use this reference when the user reviews a generated deck and wants iterative fixes.

## Feedback Memo

Create or update a feedback memo next to the source markdown:

```text
<deck-name>.feedback.md
```

If there is no single source markdown file, use:

```text
feedback/<deck-name>.md
```

Recommended format:

```markdown
# Feedback: Deck Title

## Round 1 - YYYY-MM-DD

### Slide 3 - Working title
- request: what the user wants changed
- decision: accepted / rejected / needs confirmation
- source update: markdown section or image path to edit
- status: todo / done
```

## Rules

1. Apply accepted content changes to the `.md` first, then regenerate HTML.
2. Apply runtime/style changes to the template or generated HTML path that owns the behavior.
3. Do not treat annotated `annotated-*.html` files as editable source. They are fixed lecture records.
4. Keep slide numbers stable within a feedback round. If slides are inserted or removed, start a new round and mention the renumbering.
5. Resolve each memo item with the file path changed and the generated HTML path.

## Common Feedback Types

| Feedback | Where to apply |
|---|---|
| Text, title, bullet, slide order | Source `.md` |
| Speaker note or presenter prompt | Source `.md` `> Note:` or presenter memo guidance |
| Image add/remove/swap | Source `.md` image link and local `images/` asset |
| Layout, typography, runtime controls | Template asset or generated HTML template |
| Handwritten lecture annotation | Browser runtime, then `S` fixed copy |

## Output

After applying feedback, report:

- feedback round and slide numbers changed
- markdown/source files updated
- regenerated HTML files
- unresolved review items, if any
