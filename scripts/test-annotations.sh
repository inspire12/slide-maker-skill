#!/bin/bash
set -euo pipefail

files=(
  skill/template.html
  skill/templates/monymony.html
)

while IFS= read -r html; do
  if grep -Fq 'class="slide' "$html"; then
    files+=("$html")
  fi
done < <(find slides -maxdepth 1 -type f -name '*.html' | sort)

required_patterns=(
  'id="annotationLayer"'
  'id="annotationToolbar"'
  'function toggleAnnotationMode'
  'function exportAnnotatedCopy'
  'confirm('\''Save fixed annotated HTML copy?'\'')'
  'annotated-fixed-copy'
  'html2canvas'
  'data-tool="pen"'
  'data-tool="eraser"'
  'data-tool="text"'
  'data-tool="rect"'
  'id="annotationHelp"'
  'id="presenterMemo"'
  '권장 화면'
  '1280 x 720'
  'function toggleAnnotationHelp'
  'function togglePresenterMemo'
  'function addTextAnnotation'
  'function drawRectPreview'
  'case '\''a'\'': case '\''A'\'': toggleAnnotationMode'
  'case '\''s'\'': case '\''S'\'': exportAnnotatedCopy'
  'if (e.key === '\''?'\'') { toggleAnnotationHelp(); return; }'
  'case '\''t'\'': case '\''T'\'': activateAnnotationTool('\''text'\'')'
  'case '\''r'\'': case '\''R'\'': activateAnnotationTool('\''rect'\'')'
  'case '\''m'\'': case '\''M'\'': togglePresenterMemo'
)

for file in "${files[@]}"; do
  for pattern in "${required_patterns[@]}"; do
    if ! grep -Fq "$pattern" "$file"; then
      echo "Missing annotation feature pattern in $file: $pattern" >&2
      exit 1
    fi
  done
done

echo "Annotation feature hooks found in ${#files[@]} HTML/template files."
