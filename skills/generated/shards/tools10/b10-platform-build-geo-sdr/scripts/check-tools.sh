#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b10-platform-build-geo-sdr"
echo "Checking tool availability..."

tools=(
  'dnsgen'
  'nauty'
  'triton'
  'libshout'
  'trafilatura'
  'erofs-utils'
  'kwok'
  'packetry'
  'monit'
  'h3'
  'girara'
  'proselint'
  'jreleaser'
  'lit'
  'cobo-cli'
  'distcc'
  'c2048'
  'limesuite'
  'cuetools'
  'bup'
  'ponysay'
  'gabedit'
  'codeberg-cli'
  'qtquick3dphysics'
  'mgis'
  'adaptivecpp'
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
