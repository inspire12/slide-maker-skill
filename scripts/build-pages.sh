#!/bin/bash
# Build script: organize slides into deployable directory structure
# slides/stock_story_2025.html → _site/stock_story_2025/index.html
# slides/images/ → _site/images/ (shared)

set -e

SITE_DIR="_site"
SLIDES_DIR="slides"

rm -rf "$SITE_DIR"
mkdir -p "$SITE_DIR"

# Copy shared images
if [ -d "$SLIDES_DIR/images" ]; then
  cp -r "$SLIDES_DIR/images" "$SITE_DIR/images"
fi

# Each HTML → its own directory
ENTRIES=""
# Natural sort so stock_story, stock_story2, ..., stock_story_2025 appear in order
for html in $(ls "$SLIDES_DIR"/*.html 2>/dev/null | sort -V); do
  [ -f "$html" ] || continue

  basename=$(basename "$html" .html)
  dest="$SITE_DIR/$basename"
  mkdir -p "$dest"

  # Fix image paths: images/ → ../images/ (one level up)
  sed 's|src="images/|src="../images/|g' "$html" > "$dest/index.html"

  # Extract title from <title> tag (used as subtitle if different from basename)
  title=$(sed -n 's/.*<title>\(.*\)<\/title>.*/\1/p' "$html" | head -1)

  if [ -n "$title" ] && [ "$title" != "$basename" ]; then
    ENTRIES="$ENTRIES<li><a href=\"$basename/\"><span class=\"name\">$basename</span><span class=\"desc\">$title</span></a></li>\n"
  else
    ENTRIES="$ENTRIES<li><a href=\"$basename/\"><span class=\"name\">$basename</span></a></li>\n"
  fi

  echo "  ✓ $basename/"
done

# Generate index page (slide listing)
cat > "$SITE_DIR/index.html" <<EOF
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Slides</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f0f0f2;
    color: #1d1d1f;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .container {
    max-width: 640px;
    width: 100%;
    padding: 60px 40px;
  }
  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 8px;
  }
  h1::after {
    content: '';
    display: block;
    width: 48px;
    height: 3px;
    background: #0071e3;
    margin-top: 12px;
    border-radius: 2px;
  }
  .subtitle {
    color: #86868b;
    font-size: 0.95rem;
    margin-bottom: 40px;
    margin-top: 12px;
  }
  ul { list-style: none; }
  li {
    border-bottom: 1px solid #e5e5e7;
  }
  li:last-child { border-bottom: none; }
  a {
    display: flex;
    align-items: baseline;
    gap: 14px;
    padding: 18px 0;
    color: #1d1d1f;
    text-decoration: none;
    transition: color 0.15s;
  }
  .name {
    font-size: 1.1rem;
    font-weight: 500;
  }
  .desc {
    font-size: 0.85rem;
    color: #86868b;
    flex: 1;
  }
  a:hover { color: #0071e3; }
  a:hover .desc { color: #0071e3; }
  a::after {
    content: '→';
    color: #86868b;
    transition: color 0.15s;
    margin-left: auto;
  }
  a:hover::after { color: #0071e3; }
</style>
</head>
<body>
<div class="container">
  <h1>Slides</h1>
  <p class="subtitle">presentations</p>
  <ul>
$(echo -e "$ENTRIES")
  </ul>
</div>
</body>
</html>
EOF

echo ""
echo "Built $(find "$SITE_DIR" -name index.html | wc -l | tr -d ' ') pages → $SITE_DIR/"
