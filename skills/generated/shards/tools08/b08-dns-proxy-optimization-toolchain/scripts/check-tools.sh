#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b08-dns-proxy-optimization-toolchain"
echo "Checking tool availability..."

tools=(
  'gkrellm'
  'eralchemy'
  'aqtinstall'
  'cntlm'
  'zsync'
  'auto-editor'
  'libp11'
  'highs'
  'knot-resolver'
  'glyph'
  'dmd'
  'minizinc'
  'pake'
  'redress'
  'primecount'
  'ptpython'
  'zint'
  'chatblade'
  'qtmultimedia'
  'i686-elf-grub'
  'todo-txt'
  'dnsrobocert'
  'ddclient'
  'corkscrew'
  'joe'
  'libdnet'
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
