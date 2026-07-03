---
name: sadamcon-slides
description: Create, restyle, or export markdown slide decks in the 5th Sadamcon conference style based on `slides/5기 사담콘 발표 템플릿.pdf`. Use when the user asks for 사담콘, Sadamcon, 5th Conference, SIPE conference, or wants a dark conference deck with orange/mint gradient accents.
---

# Sadamcon Slides

Use this skill to turn markdown slide content into a Sadamcon-style HTML deck or to restyle an existing deck with the 5th Sadamcon visual system.

## Workflow

1. Read `references/style-guide.md` before designing or exporting.
2. Use `assets/sadamcon.html` as the HTML shell. Replace `{{TITLE}}` and `{{SLIDES}}` with generated slide markup.
3. Preserve the markdown source as the source of truth. Generate HTML as a derived artifact.
4. Keep slides sparse: one major message per slide, large titles, compact bullets, and card/table blocks for dense content.
5. Verify generated HTML by checking slide count, unresolved `{{...}}` placeholders, image paths, and at least one rendered screenshot when browser tooling is available.

## Generation Rules

- Use 16:9 layout and test at `1280 x 720`.
- Render chapter starts as `.chapter-title` slides.
- Render `!!!message` as `.keyword-slide`.
- Render standalone `**number** label` groups as `.stat-card` rows.
- Use `.slide-content` for text-heavy cards and `.slide-split` or `.portrait-split` for image slides.
- Keep the PDF chrome: `5th CONFERENCE` at top-left and the `sip-mark.png` image mark at top-right.

## Resources

- `assets/sadamcon.html`: reusable Sadamcon HTML template.
- `assets/sip-mark.png`: source image for the top-right mark. Generated decks should also have this file available at `images/sadamcon/sip-mark.png` relative to the deck HTML.
- `references/style-guide.md`: PDF-derived visual decisions, component patterns, and validation checklist.
