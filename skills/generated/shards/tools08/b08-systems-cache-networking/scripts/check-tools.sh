#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b08-systems-cache-networking"
echo "Checking tool availability..."

tools=(
  'roswell'
  'nexus'
  'tre-command'
  'elfutils'
  'aalib'
  'libvncserver'
  'nmrpflash'
  'dzr'
  'libepoxy'
  'varnish'
  'http-prompt'
  'qman'
  'claudekit'
  'babl'
  'asc'
  'kuzu'
  'puzzles'
  'ivy'
  'travis'
  'nwchem'
  'opkssh'
  'libcap'
  'criterion'
  'libpaho-mqtt'
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
