#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b06-emulation-k8s-api-gateway-build"
echo "Checking tool availability..."

tools=(
  'fceux'
  'lmdb'
  'openmotif'
  'synfig'
  'kor'
  'stellar-cli'
  'tex-fmt'
  'mago'
  'treemd'
  'rabbitmq-c'
  'latexdiff'
  'openfst'
  'bmon'
  'fheroes2'
  'go@1.25'
  'freeswitch'
  'dosbox-staging'
  'libiscsi'
  'bash-git-prompt'
  'scalapack'
  'libtatsu'
  'pmtiles'
  'localtunnel'
  'bazarr'
  'fpc'
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
