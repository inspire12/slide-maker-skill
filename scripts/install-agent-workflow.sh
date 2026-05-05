#!/bin/bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
home_dir="${HOME:?HOME is not set}"

codex_src="$repo_root/codex/markdown-to-slide"
codex_dest="$home_dir/.codex/skills/markdown-to-slide"
agents_dest="$home_dir/.agents/skills/markdown-to-slide"
claude_src="$repo_root/skill"
claude_dest="$home_dir/.claude/skills/markdown-to-slide"

if [ ! -f "$codex_src/SKILL.md" ]; then
  echo "Missing Codex skill source: $codex_src/SKILL.md" >&2
  exit 1
fi

if [ ! -f "$claude_src/skill.md" ]; then
  echo "Missing Claude skill source: $claude_src/skill.md" >&2
  exit 1
fi

mkdir -p "$(dirname "$codex_dest")" "$(dirname "$agents_dest")" "$(dirname "$claude_dest")"

rm -rf "$codex_dest"
cp -R "$codex_src" "$codex_dest"

if [ -L "$agents_dest" ] || [ -e "$agents_dest" ]; then
  rm -rf "$agents_dest"
fi
ln -s "$codex_src" "$agents_dest"

rm -rf "$claude_dest"
mkdir -p "$claude_dest"
cp -R "$claude_src"/. "$claude_dest"/
cp "$claude_src/skill.md" "$claude_dest/SKILL.md"

echo "Installed markdown-to-slide agent workflow:"
echo "- $codex_dest"
echo "- $agents_dest"
echo "- $claude_dest"
echo ""
echo "Restart Codex or Claude Code before using the refreshed skill."
