#!/bin/bash
set -euo pipefail

skill_dir="codex/markdown-to-slide"

required_files=(
  "$skill_dir/SKILL.md"
  "$skill_dir/agents/openai.yaml"
  "$skill_dir/assets/template.html"
  "$skill_dir/assets/templates/monymony.html"
  "$skill_dir/assets/templates/sadamcon.html"
  "$skill_dir/assets/templates/sipercurl.html"
  "$skill_dir/references/slides-plan.md"
  "$skill_dir/references/slides-design.md"
  "$skill_dir/references/slides-export.md"
  "$skill_dir/references/slides-feedback.md"
  "$skill_dir/references/slides-deploy.md"
  "scripts/install-agent-workflow.sh"
)

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "Missing required Codex skill file: $file" >&2
    exit 1
  fi
done

grep -Fq "name: markdown-to-slide" "$skill_dir/SKILL.md"
grep -Fq "Use when creating, editing, exporting, or improving lecture slides" "$skill_dir/SKILL.md"
grep -Fq "assets/template.html" "$skill_dir/SKILL.md"
grep -Fq "assets/templates/sadamcon.html" "$skill_dir/SKILL.md"
grep -Fq "assets/templates/sipercurl.html" "$skill_dir/SKILL.md"
grep -Fq "references/slides-export.md" "$skill_dir/SKILL.md"
grep -Fq "references/slides-feedback.md" "$skill_dir/SKILL.md"
grep -Fq "references/slides-deploy.md" "$skill_dir/SKILL.md"
grep -Fq "Per-Slide Spec" "$skill_dir/SKILL.md"
grep -Fq "Feedback loop" "$skill_dir/SKILL.md"
grep -Fq "GitHub Actions Pages workflow" "$skill_dir/SKILL.md"
grep -Fq "Obsidian" "$skill_dir/SKILL.md"
grep -Fq "Phase 0.5" "$skill_dir/references/slides-plan.md"
grep -Fq "Phase 1.5" "$skill_dir/references/slides-plan.md"
grep -Fq "review focus" "$skill_dir/references/slides-plan.md"
grep -Fq "16:9 Slide Budget" "$skill_dir/references/slides-design.md"
grep -Fq "<deck-name>.feedback.md" "$skill_dir/references/slides-feedback.md"
grep -Fq ".github/workflows/deploy-pages.yml" "$skill_dir/references/slides-deploy.md"
grep -Fq "main" "$skill_dir/references/slides-deploy.md"
grep -Fq "claude_dest" scripts/install-agent-workflow.sh
grep -Fq 'default_prompt: "Use $markdown-to-slide' "$skill_dir/agents/openai.yaml"

cmp -s skill/template.html "$skill_dir/assets/template.html" || {
  echo "Codex default template asset is out of sync with skill/template.html" >&2
  exit 1
}

cmp -s skill/templates/monymony.html "$skill_dir/assets/templates/monymony.html" || {
  echo "Codex monymony template asset is out of sync with skill/templates/monymony.html" >&2
  exit 1
}

cmp -s skill/templates/sadamcon.html "$skill_dir/assets/templates/sadamcon.html" || {
  echo "Codex sadamcon template asset is out of sync with skill/templates/sadamcon.html" >&2
  exit 1
}

cmp -s skill/templates/sipercurl.html "$skill_dir/assets/templates/sipercurl.html" || {
  echo "Codex sipercurl template asset is out of sync with skill/templates/sipercurl.html" >&2
  exit 1
}

if grep -R -nE '(^|[^A-Za-z0-9_-])/slides-(plan|design|export)([[:space:]`<]|$)|~/.claude|Read tool|Use Glob' "$skill_dir"; then
  echo "Codex skill still contains Claude-specific command/tool wording" >&2
  exit 1
fi

python3 /Users/inspire12/.codex/skills/.system/skill-creator/scripts/quick_validate.py "$skill_dir"
