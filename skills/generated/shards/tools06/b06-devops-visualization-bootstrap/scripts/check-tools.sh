#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b06-devops-visualization-bootstrap"
echo "Checking tool availability..."

tools=(
  'serie'
  'python-freethreading'
  'c3c'
  'augeas'
  'moon'
  'xmrig'
  'simdutf'
  'sysdig'
  'prettyping'
  'tag'
  'code2prompt'
  'solr'
  'ldc'
  'f3d'
  'libxcb'
  'dockerize'
  'imagemagick-full'
  'lume'
  'findent'
  'scikit-image'
  'spice-gtk'
  'libsixel'
  'libewf'
  'grafana-alloy'
  'nload'
  'sratoolkit'
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
