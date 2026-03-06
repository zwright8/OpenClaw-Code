#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b06-modeling-crypto-k8s-observability"
echo "Checking tool availability..."

tools=(
  'recc'
  'dynare'
  'logrotate'
  'qrtool'
  'oasdiff'
  'dstack'
  'fastmcp'
  'bcrypt'
  'closure-compiler'
  'jack'
  'kubetui'
  'ffms2'
  'libimagequant'
  'libmodbus'
  'cargo-update'
  'scorecard'
  'javacc'
  'volk'
  'vnstat'
  'nzbget'
  'ignite'
  'jsonnet-bundler'
  'metals'
  'qtbase'
  'fabric'
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
