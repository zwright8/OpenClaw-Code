#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b09-signal-boot-wayland-security"
echo "Checking tool availability..."

tools=(
  'spandsp'
'x86_64-elf-grub'
'ocm'
'wayland'
'pcalc'
'dsda-doom'
'harsh'
'cmake-language-server'
'gumbo-parser'
'mawk'
'tinyxml'
'gtksourceviewmm3'
'lcm'
'webtorrent-cli'
'qtquickeffectmaker'
'aide'
'rustic'
'whalebrew'
'pandoc-plot'
'libpq@17'
'apkleaks'
'libnet'
'gi-docgen'
'apache-geode'
'bkcrack'
'fatsort'
'gtkglext'
'trezor-agent'
'proftpd'
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
