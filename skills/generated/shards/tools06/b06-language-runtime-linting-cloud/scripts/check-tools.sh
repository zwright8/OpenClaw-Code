#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b06-language-runtime-linting-cloud"
echo "Checking tool availability..."

tools=(
  'perltidy'
  'snakefmt'
  'ruby@3.0'
  'uwsgi'
  'hexedit'
  'nethack'
  'conda-lock'
  'pint'
  'guetzli'
  'fancy-cat'
  'unxip'
  'goffice'
  'bbot'
  'libxau'
  'scooter'
  'xsel'
  'whosthere'
  'mask'
  'sdl3_ttf'
  'miniserve'
  'luacheck'
  'dalfox'
  'iredis'
  'sqlite-utils'
  'strace'
  'cloudformation-cli'
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
