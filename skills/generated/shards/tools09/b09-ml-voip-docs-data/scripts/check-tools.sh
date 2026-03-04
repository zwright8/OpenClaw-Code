#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b09-ml-voip-docs-data"
echo "Checking tool availability..."

tools=(
  'pocl'
'sngrep'
'pdfsandwich'
'weaviate-cli'
'xfig'
'dxpy'
'kagent'
'libxlsxwriter'
'charmcraft'
'vet'
'sleek'
'qtvirtualkeyboard'
'qt3d'
'wavpack'
'credstash'
'vapoursynth-sub'
'emqx'
'sox_ng'
'hcledit'
'libfreenect'
'instead'
'cimg'
'gojq'
'nyx'
'cargo-expand'
'dafny'
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
