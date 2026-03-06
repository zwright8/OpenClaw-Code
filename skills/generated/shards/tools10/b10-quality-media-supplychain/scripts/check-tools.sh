#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b10-quality-media-supplychain"
echo "Checking tool availability..."

tools=(
  'gitmux'
  'ltex-ls-plus'
  'mdf2iso'
  'htmlhint'
  'rip2'
  'cyclonedx-python'
  'nak'
  'rpl'
  'audiowaveform'
  'uhubctl'
  'cargo-deny'
  'sipsak'
  'libzdb'
  'soapyhackrf'
  'libupnp'
  'libzim'
  'policy_sentry'
  'go-blueprint'
  'papilo'
  'abi3audit'
  'rtags'
  'aspcud'
  'libxml++'
  'ooniprobe'
  'forbidden'
  'rtmidi'
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
