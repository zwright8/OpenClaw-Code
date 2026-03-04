#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b08-web-audit-build-security"
echo "Checking tool availability..."

tools=(
  'lighthouse'
  'safety'
  'pyqt-builder'
  'cloudsplaining'
  'gci'
  'sftpgo'
  'x86_64-elf-gdb'
  'claws-mail'
  'dooit'
  'jhipster'
  'templ'
  'f2'
  'i2p'
  'ykpers'
  'spectral-cli'
  'detox'
  'opencore-amr'
  'dub'
  'berkeley-db@5'
  'osrm-backend'
  'pyscn'
  'pfetch'
  'bower'
  'maigret'
  'blake3'
  'vineyard'
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
