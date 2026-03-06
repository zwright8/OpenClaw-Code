#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b08-sql-format-release-desktop"
echo "Checking tool availability..."

tools=(
  'sql-language-server'
  'grok'
  'js-beautify'
  'libwmf'
  'spice-server'
  'tre'
  'djview4'
  'libsm'
  'libxpm'
  'qtdeclarative'
  'gengetopt'
  'ldid-procursus'
  'bilix'
  'alda'
  'inih'
  'amp'
  'eiffelstudio'
  'mkvtomp4'
  'quazip'
  'bluetoothconnector'
  'orc-tools'
  'release-it'
  'spack'
  'duc'
  'qtshadertools'
  'mailcatcher'
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
