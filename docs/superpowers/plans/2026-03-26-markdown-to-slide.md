# Markdown to Slide — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Claude Code skill (`/slides`) that converts markdown (and PDF/PPTX/image) files into self-contained presentation HTML with chapter/slide navigation.

**Architecture:** A skill definition (`skill.md`) drives Claude through a validate → enhance → generate pipeline. A single `template.html` contains the complete presentation engine (CSS + JS inline, highlight.js via CDN). Claude reads input, applies the template, and writes one `.html` file.

**Tech Stack:** HTML/CSS/JS (vanilla), highlight.js CDN for syntax highlighting, Claude Code skill system.

---

## File Structure

```
~/.claude/skills/markdown-to-slide/
├── skill.md              # Skill definition: trigger, workflow instructions
├── template.html         # Complete HTML template with CSS + JS inline
└── examples/
    └── sample.md         # Example markdown for reference/testing
```

---

### Task 1: Create the HTML template — CSS theme

**Files:**
- Create: `~/.claude/skills/markdown-to-slide/template.html`

- [ ] **Step 1: Create template.html with minimal theme CSS**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{TITLE}}</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
<style>
/* ===== RESET ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow: hidden; }

/* ===== BASE ===== */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #fff;
  color: #1d1d1f;
  line-height: 1.6;
}

/* ===== PROGRESS BAR ===== */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: #0071e3;
  transition: width 0.3s ease;
  z-index: 100;
}

/* ===== SLIDES ===== */
.slide {
  display: none;
  width: 100vw;
  height: 100vh;
  padding: 60px 80px;
  overflow: hidden;
}
.slide.active { display: flex; flex-direction: column; }

/* ===== CHAPTER TITLE SLIDE ===== */
.slide.chapter-title {
  justify-content: center;
  align-items: center;
  text-align: center;
}
.slide.chapter-title h1 {
  font-size: 3rem;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: -0.02em;
}
.slide.chapter-title .chapter-subtitle {
  font-size: 1.2rem;
  color: #86868b;
  margin-top: 0.5rem;
}

/* ===== CONTENT SLIDE ===== */
.slide-header {
  flex-shrink: 0;
  margin-bottom: 0;
}
.slide-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1d1d1f;
  text-align: left;
}
.slide-header-divider {
  border: none;
  border-bottom: 2px solid #e5e5e7;
  margin-top: 16px;
}
.slide-content {
  flex: 1;
  padding-top: 32px;
  font-size: 1.15rem;
  color: #333;
  overflow-y: auto;
}
.slide-content ul, .slide-content ol {
  margin-left: 1.5em;
  margin-bottom: 0.75em;
}
.slide-content li { margin-bottom: 0.4em; }
.slide-content p { margin-bottom: 0.75em; }
.slide-content img {
  max-width: 100%;
  max-height: 60vh;
  border-radius: 8px;
}

/* ===== CODE BLOCKS ===== */
.slide-content pre {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
  margin-bottom: 1em;
}
.slide-content pre code {
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  counter-reset: line;
}
.slide-content pre code .line {
  display: block;
  counter-increment: line;
}
.slide-content pre code .line::before {
  content: counter(line);
  display: inline-block;
  width: 2em;
  margin-right: 1em;
  text-align: right;
  color: #666;
  user-select: none;
}

/* ===== SPEAKER NOTES ===== */
.speaker-notes {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  padding: 20px 40px;
  font-size: 0.95rem;
  line-height: 1.5;
  max-height: 30vh;
  overflow-y: auto;
  z-index: 90;
}
.speaker-notes.visible { display: block; }

/* ===== SLIDE NUMBER ===== */
.slide-number {
  position: fixed;
  bottom: 16px;
  right: 24px;
  font-size: 0.8rem;
  color: #86868b;
  z-index: 80;
}

/* ===== TOC OVERLAY ===== */
.toc-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.97);
  z-index: 200;
  padding: 60px 80px;
  overflow-y: auto;
}
.toc-overlay.visible { display: block; }
.toc-overlay h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #1d1d1f;
}
.toc-overlay ul { list-style: none; }
.toc-overlay li {
  padding: 12px 16px;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.toc-overlay li:hover { background: #f0f0f2; }
.toc-overlay li.current { color: #0071e3; font-weight: 600; }
</style>
</head>
<body>

<div class="progress-bar" id="progressBar"></div>

{{SLIDES}}

<div class="slide-number" id="slideNumber"></div>

<div class="toc-overlay" id="tocOverlay">
  <h2>목차</h2>
  <ul id="tocList"></ul>
</div>

<!-- PRESENTATION ENGINE -->
<script>
{{ENGINE_JS}}
</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script>
document.querySelectorAll('pre code').forEach(block => {
  hljs.highlightElement(block);
  // Add line numbers
  const lines = block.innerHTML.split('\n');
  block.innerHTML = lines.map(line => '<span class="line">' + line + '</span>').join('\n');
});
</script>
</body>
</html>
```

Placeholders: `{{TITLE}}`, `{{SLIDES}}`, `{{ENGINE_JS}}` — Claude fills these during generation.

- [ ] **Step 2: Verify the file was created**

Run: `ls -la ~/.claude/skills/markdown-to-slide/template.html`
Expected: file exists

- [ ] **Step 3: Commit**

```bash
git add ~/.claude/skills/markdown-to-slide/template.html
git commit -m "feat: add slide HTML template with minimal CSS theme"
```

---

### Task 2: Create the HTML template — Presentation engine JS

**Files:**
- Modify: `~/.claude/skills/markdown-to-slide/template.html` (replace `{{ENGINE_JS}}` placeholder documentation)

The actual JS will be inlined by Claude during generation, but we need the engine code in the template as a reference implementation.

- [ ] **Step 1: Add presentation engine JS to template**

Replace the `{{ENGINE_JS}}` placeholder comment section with the actual engine code:

```javascript
(function() {
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentSlide = 0;
  let notesVisible = false;

  // Chapter index: [{title, slideIndex}]
  const chapters = [];
  slides.forEach((slide, i) => {
    if (slide.classList.contains('chapter-title')) {
      chapters.push({ title: slide.querySelector('h1').textContent, slideIndex: i });
    }
  });

  function showSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    slides[currentSlide].classList.remove('active');
    // Hide previous notes
    const prevNotes = slides[currentSlide].querySelector('.speaker-notes');
    if (prevNotes) prevNotes.classList.remove('visible');

    currentSlide = index;
    slides[currentSlide].classList.add('active');

    // Show notes if toggled on
    if (notesVisible) {
      const notes = slides[currentSlide].querySelector('.speaker-notes');
      if (notes) notes.classList.add('visible');
    }

    // Update progress bar
    const progress = totalSlides > 1 ? (currentSlide / (totalSlides - 1)) * 100 : 100;
    document.getElementById('progressBar').style.width = progress + '%';

    // Update slide number
    document.getElementById('slideNumber').textContent = (currentSlide + 1) + ' / ' + totalSlides;

    // Update TOC current marker
    updateTocCurrent();
  }

  function nextSlide() { showSlide(currentSlide + 1); }
  function prevSlide() { showSlide(currentSlide - 1); }

  function nextChapter() {
    const next = chapters.find(c => c.slideIndex > currentSlide);
    if (next) showSlide(next.slideIndex);
  }

  function prevChapter() {
    // Find the chapter before current position
    let target = null;
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (chapters[i].slideIndex < currentSlide) {
        target = chapters[i];
        break;
      }
    }
    if (target) showSlide(target.slideIndex);
  }

  function toggleNotes() {
    notesVisible = !notesVisible;
    const notes = slides[currentSlide].querySelector('.speaker-notes');
    if (notes) {
      notes.classList.toggle('visible', notesVisible);
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  function toggleToc() {
    document.getElementById('tocOverlay').classList.toggle('visible');
  }

  function buildToc() {
    const list = document.getElementById('tocList');
    chapters.forEach((ch, i) => {
      const li = document.createElement('li');
      li.textContent = ch.title;
      li.addEventListener('click', () => {
        showSlide(ch.slideIndex);
        toggleToc();
      });
      list.appendChild(li);
    });
  }

  function updateTocCurrent() {
    const items = document.querySelectorAll('#tocList li');
    items.forEach((li, i) => {
      const isCurrentChapter = chapters[i] && chapters[i].slideIndex <= currentSlide &&
        (i === chapters.length - 1 || chapters[i + 1].slideIndex > currentSlide);
      li.classList.toggle('current', isCurrentChapter);
    });
  }

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    // Ignore if TOC is open and key is not T or Escape
    const tocOpen = document.getElementById('tocOverlay').classList.contains('visible');

    if (e.key === 't' || e.key === 'T') { toggleToc(); return; }
    if (e.key === 'Escape' && tocOpen) { toggleToc(); return; }
    if (tocOpen) return;

    switch(e.key) {
      case 'ArrowRight': case ' ': nextSlide(); break;
      case 'ArrowLeft': prevSlide(); break;
      case 'ArrowUp': prevChapter(); break;
      case 'ArrowDown': nextChapter(); break;
      case 'Home': showSlide(0); break;
      case 'End': showSlide(totalSlides - 1); break;
      case 'f': case 'F': toggleFullscreen(); break;
      case 'n': case 'N': toggleNotes(); break;
    }
  });

  // Init
  buildToc();
  showSlide(0);
})();
```

- [ ] **Step 2: Verify template has both CSS and JS**

Run: `grep -c '{{' ~/.claude/skills/markdown-to-slide/template.html`
Expected: only `{{TITLE}}` and `{{SLIDES}}` placeholders remain (2 matches). `{{ENGINE_JS}}` should be replaced with actual code.

- [ ] **Step 3: Commit**

```bash
git add ~/.claude/skills/markdown-to-slide/template.html
git commit -m "feat: add presentation engine JS to template"
```

---

### Task 3: Create the example markdown

**Files:**
- Create: `~/.claude/skills/markdown-to-slide/examples/sample.md`

- [ ] **Step 1: Write sample.md with all supported features**

```markdown
---
title: Markdown to Slide 데모
author: Demo User
---

# 1장. 소개

환영합니다! 이 프레젠테이션은 **Markdown to Slide** 데모입니다.

> Note: 첫 번째 챕터의 첫 슬라이드입니다. 발표자 노트는 N 키로 토글할 수 있습니다.

---

## 주요 기능

- 마크다운에서 HTML 슬라이드 자동 생성
- 챕터 / 슬라이드 2단계 구조
- 코드 구문 하이라이팅 + 라인 넘버
- 키보드 내비게이션
- 발표자 노트 지원

> Note: 기능 목록을 하나씩 설명해주세요.

---

## 이미지 지원

![샘플 이미지](https://via.placeholder.com/600x300/e5e5e7/1d1d1f?text=Sample+Image)

이미지는 마크다운 표준 문법으로 삽입합니다.

# 2장. 코드 예시

코드 블록은 자동으로 구문 하이라이팅됩니다.

---

## JavaScript 예시

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
```

> Note: 피보나치 함수를 예시로 보여줍니다. 재귀 구현입니다.

---

## Python 예시

```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))
```

# 3장. 마무리

## 키보드 단축키

| 키 | 동작 |
|-----|------|
| ← → | 슬라이드 이동 |
| ↑ ↓ | 챕터 이동 |
| F | 전체화면 |
| N | 발표자 노트 |
| T | 목차 |

---

## 감사합니다!

질문이 있으시면 편하게 말씀해주세요.

> Note: Q&A 시간. 준비한 답변 목록을 확인하세요.
```

- [ ] **Step 2: Verify file created**

Run: `ls -la ~/.claude/skills/markdown-to-slide/examples/sample.md`
Expected: file exists

- [ ] **Step 3: Commit**

```bash
git add ~/.claude/skills/markdown-to-slide/examples/sample.md
git commit -m "feat: add example markdown with all supported features"
```

---

### Task 4: Create the skill definition

**Files:**
- Create: `~/.claude/skills/markdown-to-slide/skill.md`

- [ ] **Step 1: Write skill.md**

```markdown
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
```

- [ ] **Step 2: Verify file created**

Run: `ls -la ~/.claude/skills/markdown-to-slide/skill.md`
Expected: file exists

- [ ] **Step 3: Commit**

```bash
git add ~/.claude/skills/markdown-to-slide/skill.md
git commit -m "feat: add skill definition with full workflow"
```

---

### Task 5: End-to-end test with sample markdown

**Files:**
- Uses: `~/.claude/skills/markdown-to-slide/examples/sample.md`
- Output: `~/.claude/skills/markdown-to-slide/examples/sample.html`

- [ ] **Step 1: Run the skill on the sample markdown**

In Claude Code, run:
```
/slides ~/.claude/skills/markdown-to-slide/examples/sample.md
```

- [ ] **Step 2: Verify output file was created**

Run: `ls -la ~/.claude/skills/markdown-to-slide/examples/sample.html`
Expected: file exists, non-empty

- [ ] **Step 3: Verify HTML structure**

Run: `grep -c 'class="slide"' ~/.claude/skills/markdown-to-slide/examples/sample.html`
Expected: 9 slides (3 chapter titles + 6 content slides)

Run: `grep -c 'class="speaker-notes"' ~/.claude/skills/markdown-to-slide/examples/sample.html`
Expected: 4 (slides with `> Note:` blocks)

Run: `grep -c 'class="chapter"' ~/.claude/skills/markdown-to-slide/examples/sample.html`
Expected: 3 chapters

- [ ] **Step 4: Open in browser and verify visually**

Run: `open ~/.claude/skills/markdown-to-slide/examples/sample.html`

Verify:
- [ ] Chapter title slides display centered with large text
- [ ] Content slides have title top-left with divider and spacing
- [ ] Code blocks have syntax highlighting and line numbers
- [ ] `←` `→` keys navigate slides
- [ ] `↑` `↓` keys navigate chapters
- [ ] `F` toggles fullscreen
- [ ] `N` toggles speaker notes
- [ ] `T` shows table of contents overlay
- [ ] Progress bar updates at top
- [ ] Slide number shows at bottom-right

- [ ] **Step 5: Commit test output (optional)**

```bash
git add ~/.claude/skills/markdown-to-slide/examples/sample.html
git commit -m "test: add generated sample HTML for verification"
```

---

### Task 6: Test with non-markdown input

- [ ] **Step 1: Test with a PDF file**

Create or find a test PDF, then run:
```
/slides ./test-document.pdf
```

Verify:
- [ ] Claude reads the PDF and converts to markdown
- [ ] Shows generated markdown for user confirmation
- [ ] Proceeds with validation and generation after approval

- [ ] **Step 2: Test with an image file**

```
/slides ./test-image.png
```

Verify:
- [ ] Claude reads the image and extracts content
- [ ] Converts recognized content to slide markdown
- [ ] Shows generated markdown for user confirmation

- [ ] **Step 3: Document any issues found and fix**

If any issues are found during testing, fix the relevant files (`skill.md` or `template.html`) and commit.

```bash
git add -A
git commit -m "fix: address issues found during input format testing"
```
