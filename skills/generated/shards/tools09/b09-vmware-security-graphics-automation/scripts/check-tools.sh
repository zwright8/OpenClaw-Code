#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b09-vmware-security-graphics-automation"
echo "Checking tool availability..."

tools=(
  'docker-machine-driver-vmware'
'httm'
'reaver'
'gegl'
'ponyc'
'csvq'
'gjs'
'dita-ot'
'simple-scan'
'tt'
'file-roller'
'gbox'
'terratag'
'mikutter'
'vitetris'
'abcde'
'mdk'
'asn'
'openh264'
'qtquick3d'
'clangql'
'kubernetes-cli@1.33'
'sigstore'
'acme.sh'
'gnome-recipes'
'git-graph'
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
