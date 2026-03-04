#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b09-systems-build-automation-lint"
echo "Checking tool availability..."

tools=(
  'mmv'
'cpuid'
'davix'
'autobrr'
'stp'
'libjson-rpc-cpp'
'zig@0.14'
'qtwebview'
'gensio'
'pdnsrec'
'dbus-glib'
'petsc-complex'
'qtwebchannel'
'logstalgia'
'chocolate-doom'
'jscpd'
'qtserialbus'
'lpeg'
'qtgraphs'
'xgo'
'sextractor'
'lensfun'
'ttfautohint'
'serve'
'pidcat'
'reorder-python-imports'
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
