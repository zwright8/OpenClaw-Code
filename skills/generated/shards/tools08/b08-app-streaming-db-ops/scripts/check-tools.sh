#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b08-app-streaming-db-ops"
echo "Checking tool availability..."

tools=(
  'wails'
  'showcert'
  'pyvim'
  'nova-fairwinds'
  'dvisvgm'
  'graphviz2drawio'
  'sbom-tool'
  'netscanner'
  'aicommit2'
  'apache-pulsar'
  'libxc'
  'dspdfviewer'
  'amazon-ecs-cli'
  'git-branchless'
  'nodeenv'
  'boost-mpi'
  'morpheus'
  'pari'
  'gpsbabel'
  'mujs'
  'go-md2man'
  'sqlx-cli'
  'openrtsp'
  'cargo-bundle'
  'dissent'
  'krep'
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
