#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b06-security-api-streaming-ml"
echo "Checking tool availability..."

tools=(
  'govulncheck'
  'orocos-kdl'
  'pidgin'
  'lldpd'
  'atac'
  'fselect'
  'megatools'
  'jaq'
  'mcap'
  'vulkan-validationlayers'
  'tuios'
  'elan-init'
  'mods'
  'fn'
  'csound'
  'pastel'
  'golines'
  'cli53'
  'gator'
  'xgboost'
  'vnu'
  'mac'
  'falco'
  'mavsdk'
  'unoconv'
  'immich-go'
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
