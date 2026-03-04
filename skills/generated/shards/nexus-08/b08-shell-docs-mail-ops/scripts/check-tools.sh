#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b08-shell-docs-mail-ops"
echo "Checking tool availability..."

tools=(
  'runit'
  'plakar'
  'ydiff'
  'pdf2image'
  'gitup'
  'apprise'
  'cargo-llvm-cov'
  'mad'
  'ford'
  'clisp'
  'mob'
  'walk'
  'pugixml'
  'click'
  'mcp-publisher'
  'dovecot'
  'tccutil'
  'cargo-outdated'
  'cariddi'
  'rpds-py'
  'lcdf-typetools'
  'xeyes'
  'arxiv_latex_cleaner'
  'nixfmt'
  'easyrpg-player'
  'gat'
)

found=0
missing=0
for t in "${tools[@]}"; do
  if command -v "$t" >/dev/null 2>&1; then
    printf "[FOUND]   %s -> %s\n" "$t" "$(command -v "$t")"
    found=$((found+1))
  else
    printf "[MISSING] %s\n" "$t"
    missing=$((missing+1))
  fi
done

echo

echo "Found: $found"
echo "Missing: $missing"
