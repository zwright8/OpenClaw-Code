  #!/usr/bin/env bash
  set -euo pipefail

  echo "Skill: b07-net-media-build-cli"
  echo "Checking tool availability..."

  tools=(
    'cppman'
'clippy'
'minidlna'
'fastnetmon'
'soapysdr'
'cruft'
'dnsx'
'ghorg'
'osm2pgrouting'
'cpdf'
'dwarfutils'
'clinfo'
'ingress2gateway'
'bagels'
'xdelta'
'aws-c-s3'
'circumflex'
'undercutf1'
'moto'
'evil-helix'
'ola'
'trzsz'
'gcc@9'
'lc0'
'clang-build-analyzer'
'libimobiledevice-glue'
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
