#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b10-network-proxy-cache-sandbox"
echo "Checking tool availability..."

tools=(
  'observerward'
  'libcdio'
  'aws-es-proxy'
  'ser2net'
  'dmenu'
  'xboard'
  'autocannon'
  'libserdes'
  'smartdns'
  'vapoursynth-imwri'
  'baidupcs-go'
  'netcdf-cxx'
  'cadence-workflow'
  'torrra'
  'libgedit-gfls'
  'autorest'
  'plutobook'
  'garnet'
  'pioneers'
  'libsql'
  'gssdp'
  'geocode-glib'
  'countdown'
  'websocketpp'
  'cidr'
  'fence'
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
