#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b10-stream-build-deploy"
echo "Checking tool availability..."

tools=(
  'rsyncy'
  'bento'
  'clickhouse-odbc'
  'basti'
  'eslint_d'
  'procmail'
  'storm'
  'totp-cli'
  'aws-c-cal'
  'chuck'
  'swiftdraw'
  'pjproject'
  'ent'
  'spot'
  'di'
  'tvnamer'
  'ferron'
  'proguard'
  'c-blosc2'
  'gotests'
  'kosli-cli'
  'usb.ids'
  'fabric-installer'
  'nextflow'
  'dar'
  'ephemeralpg'
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
