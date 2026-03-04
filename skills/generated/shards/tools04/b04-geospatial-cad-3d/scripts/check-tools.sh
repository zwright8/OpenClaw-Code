#!/usr/bin/env bash
set -euo pipefail

echo 'Skill: b04-geospatial-cad-3d'
echo 'Checking mapped command availability...'

items=(
  'tippecanoe|tippecanoe'
  'gts|gts'
  'osmium-tool|osmium-tool'
  'libgeotiff|libgeotiff'
  'lammps|lammps'
  'gmt|gmt'
  'open-babel|open-babel'
  'mapnik|mapnik'
  'opencascade|opencascade'
)
found=0
missing=0
for item in "${items[@]}"; do
  tool=${item%%|*}
  cmd=${item##*|}
  if command -v "$cmd" >/dev/null 2>&1; then
    printf '[FOUND]   %-28s -> %-16s (%s)\n' "$tool" "$cmd" "$(command -v "$cmd")"
    found=$((found+1))
  else
    printf '[MISSING] %-28s -> %s\n' "$tool" "$cmd"
    missing=$((missing+1))
  fi
done

echo
echo "Found mappings: $found"
echo "Missing mappings: $missing"
