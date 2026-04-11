---
name: slides-export
description: Generate self-contained HTML presentation from designed slide markdown. Final HTML output with navigation, syntax highlighting, and optional QR code.
---

# Slides Export

디자인이 완료된 마크다운을 최종 HTML 프레젠테이션으로 변환합니다.

## Trigger

`/slides-export <file-path>` — design 단계를 거친 `.md` 파일 대상.

## Phase 3 — HTML Generation

1. Read the template file at `~/.claude/skills/markdown-to-slide/template.html`
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
     - **If the slide has an image:** check the image aspect ratio using Read tool:
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
- List keyboard shortcuts:
  - `←` `→` — Navigate slides
  - `↑` `↓` — Navigate chapters
  - `F` — Fullscreen
  - `N` — Speaker notes
  - `T` — Table of contents
  - `Home` / `End` — First / last slide
  - Each content slide shows a chapter label (top-left) and chapter progress (e.g., "2/5")

## Template Location

The HTML template is at: `~/.claude/skills/markdown-to-slide/template.html`

Read this template file and use it as the base for HTML generation. Replace the `{{TITLE}}` and `{{SLIDES}}` placeholders with generated content. The CSS and JS are already included in the template.

## Source of truth

`.md` 파일이 원본이다. 콘텐츠(텍스트 / 구조 / 이미지)는 md에서 수정한 뒤 이 단계를 다시 실행해 HTML을 재생성한다. HTML을 직접 편집해 콘텐츠를 바꾸면 md가 drift되어 다음 빌드 때 변경이 사라진다. (자세한 정책은 `skill.md` 의 "Source-of-truth policy" 참조)
