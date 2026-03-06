#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b09-emulator-python-markup-network"
echo "Checking tool availability..."

tools=(
  'openmsx'
'selene'
'flit'
'html2markdown'
'gtk-gnutella'
'fcgi'
'latex2html'
'nmstatectl'
'gnome-autoar'
'libxmu'
'ansible-cmdb'
'scotch'
'leela-zero'
'oauth2_proxy'
'gau'
'libmodplug'
'kamel'
'lilv'
'nudoku'
'qbittorrent-cli'
'showkey'
'stencil'
'chronograf'
'icoutils'
'gnustep-base'
'wifi-password'
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
