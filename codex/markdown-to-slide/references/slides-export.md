---
name: slides-export
description: Generate self-contained HTML presentation from designed slide markdown. Final HTML output with navigation, syntax highlighting, and optional QR code.
---

# Slides Export

디자인이 완료된 마크다운을 최종 HTML 프레젠테이션으로 변환합니다.

## Use

Use this reference after the markdown content and design choices are ready.

## Phase 3 — HTML Generation

1. Read the template file at `assets/template.html` relative to the skill directory. Use `assets/templates/monymony.html` if the deck is using the monymony theme.
2. Parse the markdown:
   - Extract YAML frontmatter (`title`, `author`)
   - Split by `#` headings into chapters
   - Split by `---` into slides within each chapter
   - Extract `> Note:` blocks as speaker notes
3. For each chapter:
   - Wrap all slides of the chapter in `<div class="chapter" data-chapter="{n}" data-chapter-title="{title}">`
   - Create a chapter title slide: `<div class="slide chapter-title"><h1>{chapter title}</h1></div>`
   - For each content slide in the chapter, add:
     - Chapter label: `<div class="chapter-label">{chapter title}</div>`
     - Chapter progress: `<div class="chapter-progress"></div><div class="chapter-progress-bar"><div class="fill"></div></div>`
   - For each slide in the chapter:
     - Convert markdown content to HTML
     - First `##` heading becomes the slide header
     - Remaining content goes in `slide-content`
     - **If the slide has an image:** check the image aspect ratio using available image/file inspection tools:
       - **Landscape/square image (width ≥ height):** use default split layout (`slide-split` > `split-text` left + `split-image` right)
       - **Portrait image (height > width):** use portrait split layout. Apply `portrait-split` class to `.slide`. Structure:
         ```html
         <div class="slide portrait-split active">
           <div class="slide-split-portrait">
             <div class="portrait-image"><img src="..."></div>
             <div class="portrait-content">
               <h2>Slide Title</h2>
               <hr class="slide-header-divider">
               <div class="portrait-text">...content...</div>
             </div>
           </div>
         </div>
         ```
         Image takes 45% left, title + text stacked on the right 55%.
     - **If the slide has no image:** use normal single-column `slide-content`
     - `> Note:` content goes in `speaker-notes` div
     - Wrap code blocks for highlight.js with line number support
     - **Keyword highlight:** Wrap key terms in `<strong class="keyword">`
     - **Stat cards:** Wrap standalone big numbers in `<div class="stat-card"><span class="stat-value">95%</span><span class="stat-label">설명</span></div>`
     - **Blockquote callouts:** Render `>` quotes (non-Note) as `<blockquote class="callout">`
     - **Dense slides:** Add `dense-content` class to `slide-content` when content is heavy
     - **Summary slides:** If approved in Phase 2, append summary slide with class `summary-slide` at chapter end
     - **Keyword emphasis slide:** When markdown has `!!!keyword text` or `<!-- keyword: TEXT -->`, generate a full-screen keyword slide: `<div class="slide keyword-slide"><div class="keyword-hero">TEXT</div><div class="keyword-sub">optional subtitle</div></div>`
     - **Code block enhancement:** For code blocks, apply:
       - Language label badge: `<div class="code-lang-badge">{language}</div>` above the code block
       - If code block has a title comment on line 1 (e.g., `// filename.js`), extract it as `<div class="code-title">{title}</div>`
       - Line highlighting: if markdown uses `{highlight: 3-5}` after language identifier, add `.highlighted` class to those lines
       - Copy button: add `<button class="code-copy-btn">Copy</button>` with click handler
4. **TOC slide:** After all chapter title slides are created, generate a Table of Contents slide as the 2nd slide (after the first chapter title or title slide):
   - Class: `slide toc-slide`
   - Lists all chapter titles as a numbered vertical list
   - Each item shows chapter number and title
   - Current structure: `<div class="toc-item"><span class="toc-num">01</span><span class="toc-title">{chapter}</span></div>`
5. Replace `{{TITLE}}` with the frontmatter title (or filename if no frontmatter)
5. Replace `{{SLIDES}}` with all generated slide HTML
6. Write the complete HTML to the same directory as the input file, with `.html` extension
7. If a feedback memo exists for this deck, keep it as a review record and do not embed it into the exported HTML.

## Phase 4 — QR Code Slide (Optional)

If the user provides a share URL (or the output file will be hosted), add a final QR code slide:

1. Generate a QR code using the `qrcode.js` CDN library (already included in template)
2. Create a closing slide with class `qr-slide` containing:
   - A title: "발표 자료 공유" (or custom text)
   - QR code rendered in a centered container
   - The URL as plain text below the QR code
3. The URL can be specified in frontmatter as `share_url: https://...`
4. If no `share_url` is provided, skip this phase

## Output

- Input: `./presentation.md` → Output: `./presentation.html`
- Tell the user: "Presentation saved to `{output_path}`. Open in a browser to present."
- If feedback is expected, tell the user to leave comments by slide number and keep them in `<deck-name>.feedback.md`.
- List keyboard shortcuts:
  - `←` `→` — Navigate slides
  - `↑` `↓` — Navigate chapters
  - `Home` / `End` — First / last slide
  - `F` — Fullscreen
  - `N` — Speaker notes popup
  - `?` — Annotation tutorial and shortcuts
  - `O` — Table of contents
  - `M` — Presenter prompt / private checklist memo popup
  - `A` — Toggle annotation mode
  - `T` — Add text annotation
  - `R` — Draw rectangle annotation
  - `V` — Select and move an annotation
  - `E` — Eraser while annotation mode is active
  - `C` — Clear current slide annotations while annotation mode is active
  - `S` — Confirm and save fixed annotated HTML copy

## Runtime Annotation Mode

Generated HTML includes a transparent canvas layer for lecture-time handwriting.

Recommended presentation viewport: 16:9 at `1280 x 720` or larger. Minimum practical viewport is `1024 x 576`; below that, dense slides and annotation controls may feel cramped. Check the deck in fullscreen before presenting.

1. Press `?` to show the annotation tutorial and shortcut list.
2. Press `A` to enable annotation mode. Pointer/touch input draws on the current slide instead of navigating.
3. Press `M` to open a private presenter prompt / checklist memo popup. It is saved in browser `localStorage` and excluded from fixed annotated copies.
4. Use the toolbar to choose pen, text, rectangle, eraser, color, and width.
5. Press `T` to place a text box, then click the slide and enter text.
6. Press `R` to draw a rectangle by dragging over the slide.
7. Press `V` to select an existing pen stroke, text box, or rectangle, then drag it to move.
8. Annotations are stored per slide in browser `localStorage` so refreshes do not immediately lose work.
9. Press `S` or the toolbar Save button, confirm the prompt, then render every slide into a fixed `annotated-*.html` copy. The saved copy contains slide images with annotations baked in and no editing tools.
10. The original `.md` remains the source of truth for lecture content; annotated HTML is a separate lecture record.

## Template Location

The default HTML template is at `assets/template.html` relative to the skill directory.

Read this template file and use it as the base for HTML generation. Replace the `{{TITLE}}` and `{{SLIDES}}` placeholders with generated content. The CSS and JS are already included in the template.

## Source of truth

`.md` 파일이 원본이다. 콘텐츠(텍스트 / 구조 / 이미지)는 md에서 수정한 뒤 이 단계를 다시 실행해 HTML을 재생성한다. HTML을 직접 편집해 콘텐츠를 바꾸면 md가 drift되어 다음 빌드 때 변경이 사라진다. 자세한 정책은 `SKILL.md` 의 "Source Of Truth"를 참조한다.
