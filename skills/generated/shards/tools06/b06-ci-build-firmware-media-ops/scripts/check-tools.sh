#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b06-ci-build-firmware-media-ops"
echo "Checking tool availability..."

tools=(
  'icdiff'
  'percona-xtrabackup'
  'shellspec'
  'babel'
  'mapserver'
  'premake'
  'boost-build'
  'vsftpd'
  'commitlint'
  'nixpacks'
  'monero'
  'dockerfile-language-server'
  'fwupd'
  'mist-cli'
  'gonzo'
  'air'
  'id3v2'
  'cpprestsdk'
  'xdotool'
  'tsduck'
  'heimdal'
  'fileicon'
  'aubio'
  'lazyjournal'
  'u-boot-tools'
  'pdfpc'
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
