#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b09-cli-audit-3d-filesystems"
echo "Checking tool availability..."

tools=(
  'mcphost'
'instalooter'
'clifm'
'ssh-audit'
'coin3d'
'restish'
'tweakcc'
'slumber'
'unshield'
'kubo'
'cp2k'
'qtimageformats'
'lolcrab'
'softhsm'
'pipgrip'
'python-launcher'
'castxml'
'hermit'
'msedit'
'fastly'
'libnfc'
'cryptopp'
'nrm'
'pythran'
'nelm'
'diskonaut'
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
