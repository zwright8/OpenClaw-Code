#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b09-packaging-audio-vcs-qt"
echo "Checking tool availability..."

tools=(
  'rattler-build'
'libpthread-stubs'
'gersemi'
'librespot'
'got'
'podsync'
'wasi-libc'
'ncmdump'
'kin'
'yorkie'
'libhandy'
'semver'
'dropbear'
'ninvaders'
'pkg-config-wrapper'
'cmark'
'excalidraw-converter'
'mani'
'jsign'
'qtnetworkauth'
'neocmakelsp'
'projectm'
'uuu'
'cargo-generate'
'qtdatavis3d'
'qwt'
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
