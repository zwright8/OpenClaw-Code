#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b09-emulation-math-qt-dataflow"
echo "Checking tool availability..."

tools=(
  'pc6001vx'
'lgogdownloader'
'symengine'
'blueprint-compiler'
'yaz'
'mrbayes'
'vipsdisp'
'juju'
'spades'
'pass-otp'
'npth'
'imap-uw'
'doge'
'libtorrent-rakshasa'
'falcosecurity-libs'
'flash'
'readsb'
'diffnav'
'docker-ls'
'enter-tex'
'qt-postgresql'
'zuban'
'makepkg'
'abcmidi'
'xinit'
'psql2csv'
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
