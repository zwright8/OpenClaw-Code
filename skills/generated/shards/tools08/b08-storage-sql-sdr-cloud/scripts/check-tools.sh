#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b08-storage-sql-sdr-cloud"
echo "Checking tool availability..."

tools=(
  'sshfs'
  'prestodb'
  'electric'
  'ffmpeg2theora'
  'gmailctl'
  'libint'
  'revive'
  'rtk'
  'widelands'
  'neko'
  'skillshare'
  'fatal'
  'angle-grinder'
  'sigrok-cli'
  'qtwebsockets'
  'exempi'
  'imgdiet'
  'libcaca'
  'inspectrum'
  'sipcalc'
  'lemon'
  'smug'
  'git-octopus'
  'c7n'
  'jp'
  'librasterlite2'
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
