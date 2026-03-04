#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b09-benchmark-messaging-containers-crypto"
echo "Checking tool availability..."

tools=(
  'phoronix-test-suite'
'tdlib'
'diffoci'
'popt'
'dmtx-utils'
'csview'
'packmol'
'sparse'
'sendme'
'libvidstab'
'cargo-zigbuild'
'yubikey-agent'
'xml-coreutils'
'swagger-codegen@2'
'coal'
'spirv-headers'
'pbzip2'
'termshark'
'clair'
'unisonlang'
'cargo-shear'
'jena'
'mqttui'
'thanos'
'xtrans'
'gnupg@1.4'
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
