#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b06-editor-agent-network-subtitle-pdf"
echo "Checking tool availability..."

tools=(
  'krakend'
  'kakoune'
  'vtcode'
  'dvr-scan'
  'osslsigncode'
  'superhtml'
  'powerman'
  'c2patool'
  'rye'
  'rmlint'
  'inframap'
  'podofo'
  'wasm-pack'
  'tcpreplay'
  'chezscheme'
  'zmap'
  'telegram-downloader'
  'subliminal'
  'okta-awscli'
  'gulp-cli'
  'nextdns'
  'gradle-profiler'
  'claude-cmd'
  'khal'
  'pdfalyzer'
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
