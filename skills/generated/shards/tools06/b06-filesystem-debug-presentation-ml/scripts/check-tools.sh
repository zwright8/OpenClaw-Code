#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b06-filesystem-debug-presentation-ml"
echo "Checking tool availability..."

tools=(
  'cargo-sweep'
  'clipboard'
  'libxmlb'
  'a2ps'
  'kubernetes-cli@1.32'
  'hostess'
  'karchive'
  'phoneinfoga'
  'riscv64-elf-gdb'
  'chisel'
  'lux'
  'bastet'
  'pydantic'
  'check'
  'jrnl'
  'pympress'
  'global'
  'spirv-llvm-translator'
  'mpi4py'
  'allegro'
  'tinyproxy'
  'pyenv-virtualenvwrapper'
  'ncnn'
  'felinks'
  'hk'
  'dylibbundler'
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
