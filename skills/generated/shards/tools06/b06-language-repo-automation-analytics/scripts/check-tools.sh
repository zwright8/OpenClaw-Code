#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b06-language-repo-automation-analytics"
echo "Checking tool availability..."

tools=(
  'haxe'
  'libcerf'
  'kotlin-language-server'
  'pscale'
  'minipro'
  'dotslash'
  'man-db'
  'astroterm'
  'bandcamp-dl'
  'ruby@3.4'
  'git-sizer'
  'rdfind'
  'chainloop-cli'
  'pueue'
  'openfga'
  'freeipmi'
  'kaskade'
  'igraph'
  'libvterm'
  'glade'
  'offlineimap'
  'libsolv'
  'matplotplusplus'
  'bbtools'
  'dateutils'
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
