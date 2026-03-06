#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b06-recon-data-k8s-workflows"
echo "Checking tool availability..."

tools=(
  'glooctl'
  'wtfis'
  'chsrc'
  'genact'
  'rv'
  'zlib-ng'
  'libiodbc'
  'changie'
  'mvnvm'
  'rakudo'
  'gdown'
  'rgbds'
  'questdb'
  'editorconfig'
  'doxx'
  'katana'
  'fish-lsp'
  'ki18n'
  'efl'
  'libphonenumber'
  'kn'
  'aws-console'
  'jiratui'
  'autotrace'
  'helm-docs'
  'cpufetch'
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
