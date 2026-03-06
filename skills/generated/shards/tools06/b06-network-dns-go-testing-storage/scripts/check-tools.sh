#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b06-network-dns-go-testing-storage"
echo "Checking tool availability..."

tools=(
  'libxrandr'
  'icann-rdap'
  'dnstwist'
  'dwarfs'
  'notcurses'
  'jetty'
  'hwatch'
  'cdncheck'
  'udunits'
  'coredns'
  'bore-cli'
  'par2'
  'gotestsum'
  'jql'
  'saxon'
  'ddns-go'
  'rio-terminal'
  'pipdeptree'
  'libpostal'
  'chrome-devtools-mcp'
  'ballerina'
  'artillery'
  'aravis'
  'patchutils'
  'seaweedfs'
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
