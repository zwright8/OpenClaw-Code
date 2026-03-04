#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b06-credentials-openapi-python-build-tools"
echo "Checking tool availability..."

tools=(
  'usbredir'
  'jump'
  'mailsy'
  'knock'
  'git-credential-libsecret'
  'libsmi'
  'opencc'
  'mpc'
  'storj-uplink'
  'faudio'
  'btcli'
  'xk6'
  'gpsd'
  'openapi'
  'lla'
  'cargo-audit'
  'linux-headers@5.15'
  'pgrouting'
  'bookokrat'
  'mac-cleanup-py'
  'vlang'
  'recode'
  'crosstool-ng'
  'bazel@7'
  'libpst'
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
