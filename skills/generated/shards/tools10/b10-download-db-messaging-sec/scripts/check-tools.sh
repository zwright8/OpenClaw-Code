#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b10-download-db-messaging-sec"
echo "Checking tool availability..."

tools=(
  'xurls'
  'tz'
  'mysqltuner'
  'bsdiff'
  'feluda'
  'cargo-auditable'
  'ecm'
  'gopeed'
  'libid3tag'
  'crow'
  'alive2'
  'webdav'
  'aicommits'
  'dblab'
  'cdogs-sdl'
  'center-im'
  'qdmr'
  'airspy'
  'libgsm'
  'easyeda2kicad'
  'png++'
  'uni'
  'fuseki'
  'jenkins-job-builder'
  'retire'
  'cargo-release'
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
