#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b08-tunnel-embedded-observability"
echo "Checking tool availability..."

tools=(
  'wstunnel'
  'qttools'
  'pinocchio'
  'clang-uml'
  'riscv64-elf-binutils'
  'libvirt-glib'
  'bindgen'
  'jupytext'
  'nvc'
  'iso-codes'
  'tomcat-native'
  'hysteria'
  'i386-elf-gdb'
  'pdftohtml'
  'fennel'
  'dotenv-linter'
  'helmsman'
  'czg'
  'bulk_extractor'
  'grsync'
  'libbladerf'
  'terramaid'
  'opensearch-dashboards'
  'exif'
  'libxi'
  'golangci-lint-langserver'
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
