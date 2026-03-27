---
name: slides
description: Convert markdown (or PDF/PPTX/image) to a self-contained presentation HTML file. Use when the user wants to create slides, presentations, or decks from markdown content.
---

# Markdown to Slide

Convert input files into a self-contained HTML presentation with chapter/slide navigation, syntax highlighting, and speaker notes.

## Trigger

`/slides <file-path>` — accepts `.md`, `.pdf`, `.pptx`, `.png`, `.jpg` files.

## Workflow

### Phase 0 — Input Preprocessing

If the input is NOT a `.md` file, convert it to markdown first:

| Format | Method |
|--------|--------|
| `.md` | Skip to Phase 1 |
| `.pdf` | Use Read tool to extract content → convert to slide markdown with `#` chapters and `---` separators |
| `.pptx` | Use Read tool to extract slides → convert to slide markdown with `#` chapters and `---` separators |
| `.png`, `.jpg`, `.jpeg` | Use Read tool to recognize image content → convert to slide markdown |

After conversion, show the generated markdown to the user and ask for confirmation before proceeding.

### Phase 1 — Validation

Read the markdown and check:

1. **Structure check:** Are `#` (chapters) and `---` (slide separators) used correctly?
2. **Empty slides:** Any slides with no content between separators?
3. **Missing titles:** Any content slides without a heading (`## title`)?
4. **Code blocks:** Any code blocks missing a language identifier?
5. **Image paths:** Do local image paths exist? (Use Glob to verify)

Report all findings to the user as a numbered list.

### Phase 2 — Enhancement Suggestions

Analyze each slide and suggest improvements:

1. **Content overload:** If a slide has more than ~8 bullet points or ~200 words, suggest splitting.
2. **Key points:** Suggest summarizing dense paragraphs into bullet points.
3. **Speaker notes:** For slides without `> Note:` blocks, suggest auto-generated speaker notes.

Present suggestions to the user. Apply only the ones they approve.

### Phase 2.5 — Image Auto-Matching

If an `images/` directory exists in the same directory as the input file (e.g., `slides/images/`):

1. **Scan images:** Use Glob to find all images in the directory (`images/*.{png,jpg,jpeg,gif,svg}`)
2. **Recognize content:** Use Read tool to view each image and understand what it contains
3. **Match to slides:** For each slide, determine if any image is relevant based on:
   - Slide title and content keywords
   - Image content/subject matter
   - Visual appropriateness for the slide topic
4. **Suggest placements:** Present a mapping to the user:
   ```
   슬라이드 "양자컴퓨터 버블 붕괴" ← images/quantum_crash.png
   슬라이드 "수익 곡선" ← images/profit_chart.png
   슬라이드 "1년 항해 계획" ← (매칭 이미지 없음)
   ```
5. **Apply approved matches:** Insert `![](images/filename)` into the approved slides

If no `images/` directory exists, skip this phase.

### Phase 3 — HTML Generation

1. Read the template file at `~/.claude/skills/markdown-to-slide/template.html`
2. Parse the markdown:
   - Extract YAML frontmatter (`title`, `author`)
   - Split by `#` headings into chapters
   - Split by `---` into slides within each chapter
   - Extract `> Note:` blocks as speaker notes
3. For each chapter:
   - Create a chapter title slide: `<div class="slide chapter-title"><h1>{chapter title}</h1></div>`
   - For each slide in the chapter:
     - Convert markdown content to HTML
     - First `##` heading becomes the slide header
     - Remaining content goes in `slide-content`
     - `> Note:` content goes in `speaker-notes` div
     - Wrap code blocks for highlight.js with line number support
4. Replace `{{TITLE}}` with the frontmatter title (or filename if no frontmatter)
5. Replace `{{SLIDES}}` with all generated slide HTML
6. Write the complete HTML to the same directory as the input file, with `.html` extension

### Output

- Input: `./presentation.md` → Output: `./presentation.html`
- Tell the user: "Presentation saved to `{output_path}`. Open in a browser to present."
- List keyboard shortcuts:
  - `←` `→` — Navigate slides
  - `↑` `↓` — Navigate chapters
  - `F` — Fullscreen
  - `N` — Speaker notes
  - `T` — Table of contents
  - `Home` / `End` — First / last slide

## Markdown Syntax Reference

```markdown
---
title: Presentation Title
author: Author Name
---

# Chapter Title        ← Creates chapter title slide

Content for first slide

> Note: Speaker notes go here.

---                     ← Slide separator (within chapter)

## Slide Title          ← Content slide with title

- Bullet points
- More content

# Next Chapter          ← New chapter starts
```

## Template Location

The HTML template is at: `~/.claude/skills/markdown-to-slide/template.html`

Read this template file and use it as the base for HTML generation. Replace the `{{TITLE}}` and `{{SLIDES}}` placeholders with generated content. The CSS and JS are already included in the template.
