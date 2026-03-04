#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b10-terminal-java-media-forensics"
echo "Checking tool availability..."

tools=(
  'wmctrl'
  'hapi-fhir-cli'
  'openj9'
  'acronym'
  'superseedr'
  'gearman'
  'dash-mpd-cli'
  'wifitui'
  'tree-sitter@0.25'
  'cpm'
  'khard'
  'qt-libiodbc'
  'koka'
  'sandvault'
  'animdl'
  'gucharmap'
  'gifcap'
  'aws-c-auth'
  'fast_float'
  'chainsaw'
  'ccextractor'
  'ebook-tools'
  'gnmic'
  'cadence'
  'miniflux'
  'mr'
  'sloccount'
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
