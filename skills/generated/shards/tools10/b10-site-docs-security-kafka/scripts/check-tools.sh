#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b10-site-docs-security-kafka"
echo "Checking tool availability..."

tools=(
  'eleventy'
  'protoc-gen-doc'
  'libtommath'
  'lxi-tools'
  'jaguar'
  'lstr'
  'swag'
  'soapyrtlsdr'
  'atkmm@2.28'
  'git-delete-merged-branches'
  'imgp'
  'libdrm'
  'jhead'
  'varlock'
  'qhull'
  'chdig'
  'autocode'
  'ltex-ls'
  'pvetui'
  'libopusenc'
  'pocsuite3'
  'scummvm-tools'
  'urlview'
  'votca'
  'qt-mariadb'
  'yozefu'
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
