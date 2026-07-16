#!/bin/bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

files=(
  skill/template.html
  skill/templates/monymony.html
  skill/templates/sadamcon.html
  skill/templates/sipercurl.html
)

while IFS= read -r html; do
  if grep -Fq 'class="slide' "$html" || grep -Fq '.slide' "$html"; then
    files+=("$html")
  fi
done < <(find slides -maxdepth 1 -type f -name '*.html' | sort)

while IFS= read -r html; do
  if grep -Fq 'class="slide' "$html" || grep -Fq '.slide' "$html"; then
    files+=("$html")
  fi
done < <(find skill/examples -type f -name '*.html' | sort)

required_patterns=(
  '--slide-base-w: 1280px'
  '--slide-base-h: 720px'
  '--slide-scale: 1'
  'width: var(--slide-base-w)'
  'height: var(--slide-base-h)'
  'scale(var(--slide-scale'
  'function fitSlideViewport'
  "setProperty('--slide-scale'"
  "setProperty('--scale'"
)

for file in "${files[@]}"; do
  for pattern in "${required_patterns[@]}"; do
    if ! grep -Fq -- "$pattern" "$file"; then
      echo "Missing fixed-canvas pattern in $file: $pattern" >&2
      exit 1
    fi
  done

  if grep -Fq -- '--slide-w: min(100vw' "$file"; then
    echo "Old viewport-derived slide width token remains in $file" >&2
    exit 1
  fi

  if grep -Fq -- 'width: min(100vw, 177.78vh)' "$file" ||
     grep -Fq -- 'width: min(100vw, 177.7778vh)' "$file"; then
    echo "Old viewport-sized slide width remains in $file" >&2
    exit 1
  fi
done

echo "Fixed-canvas scaling hooks found in ${#files[@]} HTML/template files."
