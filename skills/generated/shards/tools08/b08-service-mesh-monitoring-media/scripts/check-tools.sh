#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b08-service-mesh-monitoring-media"
echo "Checking tool availability..."

tools=(
  'linkerd'
  'gupnp'
  'rcm'
  'ggc'
  'vorbis-tools'
  'tmux-mem-cpu-load'
  'gerbv'
  'nbdime'
  'libsigrok'
  'nom'
  'kerl'
  'collectd'
  'eigenpy'
  'espflash'
  'erlang@26'
  'loc'
  'pan'
  'spaceman-diff'
  'malcontent'
  'azion'
  'qtsvg'
  'speex'
  'spectra'
  'openapi-diff'
  'dyld-headers'
  'chardet'
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
