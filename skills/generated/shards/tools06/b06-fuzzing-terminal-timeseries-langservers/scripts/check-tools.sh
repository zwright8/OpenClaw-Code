#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b06-fuzzing-terminal-timeseries-langservers"
echo "Checking tool availability..."

tools=(
  'rapidjson'
  'afl++'
  'tmuxai'
  'vpn-slice'
  'reuse'
  'console_bridge'
  'navidrome'
  'singular'
  'aws-rotate-key'
  'lld@20'
  'medusa'
  'kdoctools'
  'libpulsar'
  'asymptote'
  'faac'
  'grace'
  'net-tools'
  'janet'
  'influxdb@1'
  'vue-language-server'
  'filebrowser'
  'cvs'
  'cpp-httplib'
  'rocq'
  'aws-crt-cpp'
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
