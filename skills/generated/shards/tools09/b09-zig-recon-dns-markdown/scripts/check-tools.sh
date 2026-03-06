#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b09-zig-recon-dns-markdown"
echo "Checking tool availability..."

tools=(
  'zigup'
'arjun'
'drill'
'mdformat'
'libcouchbase'
'modules'
'sylpheed'
'clazy'
'gcc@10'
'erlang@25'
'carla'
'dnsdist'
'gammaray'
'atop'
'rmpc'
'kaitai-struct-compiler'
'wayland-protocols'
'binsider'
'libxcursor'
'bench'
'lasso'
'alot'
'fedify'
'up'
'qt-mysql'
'qtpositioning'
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
