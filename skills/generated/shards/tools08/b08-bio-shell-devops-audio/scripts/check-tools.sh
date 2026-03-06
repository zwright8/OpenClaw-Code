#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b08-bio-shell-devops-audio"
echo "Checking tool availability..."

tools=(
  'seqtk'
  'rm-improved'
  'librime'
  'libsoxr'
  'nu'
  'noir'
  'daemon'
  'tcpflow'
  'picard-tools'
  'ruff-lsp'
  'qjackctl'
  'chart-releaser'
  'qt5compat'
  'nanobind'
  'dfu-programmer'
  'cloudflare-quiche'
  'davmail'
  'pangomm'
  'corsixth'
  'jupyter-r'
  'kubevela'
  'supertux'
  'ansible-language-server'
  'apt'
  'woodpecker-cli'
  'ckan'
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
