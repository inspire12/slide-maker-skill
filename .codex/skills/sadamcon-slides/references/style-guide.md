# 5th Sadamcon Style Guide

Source: `slides/5기 사담콘 발표 템플릿.pdf` rendered as 26 pages, 720 x 405 pt, 16:9.

## Visual Identity

- Base canvas: dark charcoal, close to `#191B1D`.
- Header chrome: small `5th CONFERENCE` at top-left and the rounded `sip-mark.png` image mark at top-right.
- Accent: warm orange around `#F9A24A`; use mint `#8EE4CC` only inside gradients or supporting visual shapes.
- Text: white for titles, cool gray for body and labels.
- Image placeholders: flat medium gray blocks with small centered placeholder icon.
- Shape language: low-radius rounded rectangles and pills; avoid large decorative cards beyond actual content containers.

## Layout Patterns

- Speaker/title slide: left image placeholder, right speaker name and short bullets.
- Title/agenda slide: centered title over large orange-to-mint gradient glow, with numbered content card below.
- Content card slide: title at top-left, one dark content panel below, orange bullets or numbered circles.
- Split slide: text/card on one side and gray image placeholder on the other.
- Keyword slide: centered cloud/icon or short phrase with orange emphasis.
- Diagram slide: orange/mint overlapping circles, arrows, and short labels; keep diagram text minimal.
- Closing/summary slide: two-column text blocks, orange headings, dark background.

## Markdown Mapping

- `# Chapter`: create a gradient `.chapter-title` slide.
- `## Title`: create a standard content slide.
- `!!!Phrase`: create a centered `.keyword-slide`.
- `**3개** 핵심 메시지`: create stat cards.
- `>` blockquote: create an orange-left-border callout.
- Tables: use only when the data is compact enough for one card.

## Quality Bar

- Titles should fit within one or two lines at 1280 x 720.
- Body content should stay under 6 bullets or 120 Korean characters per block.
- Keep top chrome visible and uncluttered. The top-right mark should render from `images/sadamcon/sip-mark.png`, not a text approximation.
- Avoid white backgrounds except for external screenshots or exported assets.
- Verify: no unresolved placeholders, no missing image paths, and rendered screenshots show readable text with no overlap.
