#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b10-shell-observability-netops"
echo "Checking tool availability..."

tools=(
  'qtquicktimeline'
  'oils-for-unix'
  'victorialogs'
  'diceware'
  'snakeviz'
  'chkbit'
  'nuxeo'
  'fend'
  'gtkdatabox'
  'cli11'
  'dcfldd'
  'hypre'
  'zsh-autopair'
  'obfs4proxy'
  'flamegraph'
  'tfmigrate'
  'killport'
  'scamper'
  'xleak'
  'packer-completion'
  'iamy'
  'cbindgen'
  'eask-cli'
  'gf'
  'zabbix-cli'
  'sampler'
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
