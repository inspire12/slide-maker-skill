---
name: markdown-to-slide
description: Use when creating, editing, exporting, or improving lecture slides, presentations, or HTML slide decks from markdown, PDF, PPTX, images, or existing slide HTML.
---

# Markdown to Slide

Create self-contained HTML presentation decks from markdown or converted source material. The markdown file is the source of truth for slide content; generated HTML is the presentation/runtime artifact.

## When To Use

Use this skill when the user wants to:

- create lecture or presentation slides from markdown, PDF, PPTX, images, or notes
- improve slide structure, speaker notes, visual hierarchy, or image placement
- export or regenerate a self-contained HTML slide deck
- update the runtime slide template, including annotation tools and presenter helpers

Do not use this for unrelated websites or general document editing.

## Workflow

1. Inspect the input and repo layout.
2. If input is not markdown, convert/extract the content into markdown first.
3. Plan slide structure. See `references/slides-plan.md` when validating chapters, separators, images, dense slides, or speaker notes.
4. Apply design improvements. See `references/slides-design.md` when choosing layout, emphasis, image matching, or dense-content treatment.
5. Export HTML from a template asset. Use `assets/template.html` by default, or `assets/templates/monymony.html` when the deck is using that theme.
6. If content changes, update the `.md` first and regenerate HTML. If runtime/style changes, update the template and any generated HTML that should immediately receive the change.
7. Verify with the project’s build/test commands where available.

## Markdown Contract

```markdown
---
title: Presentation Title
author: Author Name
share_url: https://example.com/slides
---

# Chapter Title

## Slide Title

- Bullet point
- Another point

> Note: Speaker notes go here.

---

!!!Full-screen keyword slide
```

Rules:

- `#` starts a chapter and creates a chapter title slide.
- `---` separates slides inside a chapter.
- `##` is the normal content slide heading.
- `> Note:` is presenter-only speaker notes.
- `!!!text` or `<!-- keyword: text -->` creates a full-screen keyword slide.
- Local images should use paths relative to the markdown file, typically `images/...`.

## Runtime Features

Generated decks include keyboard navigation, speaker-note support, print/PDF support, QR slides when `share_url` exists, and lecture-time annotations.

Important shortcuts:

- Arrow keys: slide/chapter navigation
- `F`: fullscreen
- `N`: speaker notes popup
- `M`: private presenter memo popup
- `?`: annotation tutorial and viewport guide
- `A`: annotation mode
- `T`: text annotation
- `R`: rectangle annotation
- `V`: select and move annotation
- `E`: eraser
- `C`: clear current slide annotations
- `S`: confirm and save a fixed annotated HTML copy

Recommended presentation viewport: 16:9 at `1280 x 720` or larger. Minimum practical viewport is `1024 x 576`.

## Assets

- Default template: `assets/template.html`
- Monymony theme: `assets/templates/monymony.html`
- References: `references/slides-plan.md`, `references/slides-design.md`, `references/slides-export.md`

When using assets, resolve paths relative to this skill directory.

## Source Of Truth

- Content edits: update markdown first, then regenerate HTML.
- Runtime/style edits: update template assets, then refresh affected generated HTML.
- Annotated `annotated-*.html` files are fixed lecture records, not source files.
