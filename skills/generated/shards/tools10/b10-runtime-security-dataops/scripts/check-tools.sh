#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b10-runtime-security-dataops"
echo "Checking tool availability..."

tools=(
  'qttranslations'
  'garble'
  'astgen'
  'orientdb'
  'amber'
  'halide'
  'i686-elf-binutils'
  'acl2'
  'atkmm'
  'xbyak'
  'xsimd'
  's4cmd'
  'grizzly'
  'massdns'
  'libseccomp'
  'moodle-dl'
  'fnt'
  'daq'
  'shimmy'
  'g-ls'
  'lando-cli'
  'doltgres'
  'dezoomify-rs'
  'brogue'
  'infat'
  'cql'
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
