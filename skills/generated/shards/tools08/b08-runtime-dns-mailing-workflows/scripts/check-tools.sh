#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b08-runtime-dns-mailing-workflows"
echo "Checking tool availability..."

tools=(
  'uvwasi'
  'solc-select'
  'shairport-sync'
  'keystone'
  'wasi-runtimes'
  'pgbadger'
  'dmg2img'
  'kiota'
  'libsass'
  'ktop'
  'gtkmm'
  'icecast'
  'xsane'
  'dfc'
  'fetchmail'
  'dnsviz'
  'evernote2md'
  'mako'
  'osm-gps-map'
  'lzfse'
  'cargo-instruments'
  'quickjs'
  'llvm@21'
  'libxt'
  'sassc'
  'cadaver'
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
