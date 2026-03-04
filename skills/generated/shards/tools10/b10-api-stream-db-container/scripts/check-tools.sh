#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b10-api-stream-db-container"
echo "Checking tool availability..."

tools=(
  'dict'
  'alpine'
  'bombardier'
  'chmlib'
  'flarectl'
  'dockly'
  'slepc'
  'httpyac'
  'nats-streaming-server'
  'libsigc++'
  'libpanel'
  'osmosis'
  'oxen'
  'plutoprint'
  'bfs'
  'sqliteodbc'
  'flix'
  'rethinkdb'
  'yo'
  'ntl'
  'microsocks'
  'lue-reader'
  'mcp-server-kubernetes'
  'jpeginfo'
  'bashunit'
  'influxdb@2'
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
