#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b06-partition-radio-testing-data"
echo "Checking tool availability..."

tools=(
  'byacc'
  'gptfdisk'
  'urh'
  'gauge'
  'spark'
  'libatomic_ops'
  'speexdsp'
  'mockserver'
  'neovim-remote'
  'glibmm@2.66'
  'deck'
  'enzyme'
  'choose-rust'
  'pyupgrade'
  'recon-ng'
  'xsv'
  'xplr'
  'basex'
  'fakeroot'
  'xcode-kotlin'
  'aws-google-auth'
  'shadowsocks-libev'
  'dfmt'
  'couchdb'
  'faircamp'
  'ov'
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
