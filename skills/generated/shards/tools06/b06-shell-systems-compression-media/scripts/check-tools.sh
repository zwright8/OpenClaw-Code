#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b06-shell-systems-compression-media"
echo "Checking tool availability..."

tools=(
  'gitg'
  'ouch'
  'grex'
  'lmod'
  'distrobox'
  'yle-dl'
  'xdot'
  'libaec'
  'pygit2'
  'libjwt'
  'systemc'
  'swiftly'
  'hopenpgp-tools'
  'minizip'
  'ice'
  'qalculate-qt'
  'mgba'
  'cloud-provider-kind'
  'alsa-lib'
  'flint'
  'mysql-connector-c++'
  'smlfmt'
  'podlet'
  'source-highlight'
  'nethogs'
  'pngcrush'
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
