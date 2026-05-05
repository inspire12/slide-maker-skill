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

1. Intake: collect the topic, audience, lecture length, desired tone, source materials, available images, desired page count, and image-generation expectations.
2. Source synthesis: inspect provided text/PDF/PPTX/images and extract a candidate story arc. Normalize Markdown/Obsidian syntax before planning.
3. Lecture outline: propose chapters and learning objectives before drafting slides.
4. Per-slide planning: create a slide spec for each slide before writing final markdown. See `references/slides-plan.md`.
5. Markdown draft: convert approved slide specs into the markdown contract below.
6. HTML export: use `assets/template.html` by default, or `assets/templates/monymony.html` when the deck is using that theme.
7. Feedback loop: collect feedback by slide number in a feedback memo, update the `.md` first, regenerate HTML, and repeat until approved. See `references/slides-feedback.md`.
8. Publish: after final approval, verify the generated site and use the repo's GitHub Actions Pages workflow to deploy the lecture archive. See `references/slides-deploy.md`.
9. Verify with the project’s build/test commands where available.

## Source Intake

When the source is a topic, loose notes, images, or an Obsidian/Markdown document:

- Preserve the user's source material. Do not edit original notes unless explicitly asked.
- Convert frontmatter, headings, wikilinks, embeds, callouts, tables, code blocks, and image links into ordinary slide markdown.
- Resolve local images relative to the source document. If an image cannot be resolved, leave a precise placeholder or review item in the slide spec.
- Prefer one clear idea per slide over preserving every source paragraph.
- Keep Korean text as editable markdown/HTML text, not baked into generated images.

## Per-Slide Spec

Before writing the final markdown for each slide, reason with this compact spec:

```markdown
### Slide N: Working title
- purpose: one sentence describing what the audience should understand
- key message: the phrase or claim that should be visually dominant
- source material: notes, document pages, links, or image filenames used
- visual: image path, generated/search-needed image, diagram, or none
- layout: basic / split-image / quote / stat-card / timeline / code-heavy / keyword
- visual budget: expected 16:9 fit risk, especially long Korean text or tall images
- speaker note: what the lecturer should say beyond the visible text
- review focus: what needs user confirmation
```

Use the spec to split overloaded content, choose images, and make feedback precise. Do not include the spec in the final deck unless the user asks for it.

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

Recommended presentation viewport: 16:9 at `1280 x 720` or larger. Minimum practical viewport is `1024 x 576`. For dense lecture decks, review at `1920 x 1080` or browser fullscreen before delivery.

## Assets

- Default template: `assets/template.html`
- Monymony theme: `assets/templates/monymony.html`
- References: `references/slides-plan.md`, `references/slides-design.md`, `references/slides-export.md`, `references/slides-feedback.md`, `references/slides-deploy.md`

When using assets, resolve paths relative to this skill directory.

## Source Of Truth

- Content edits: update markdown first, then regenerate HTML.
- Runtime/style edits: update template assets, then refresh affected generated HTML.
- Annotated `annotated-*.html` files are fixed lecture records, not source files.
- Feedback memos are planning records. Apply accepted feedback to the markdown, regenerate HTML, then mark the memo item resolved.
- Published GitHub Pages output is the lecture archive, not the editable source. Keep source markdown and generated HTML in git before deploy.
