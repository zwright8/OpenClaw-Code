#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b09-parallel-qt-supabase-database"
echo "Checking tool availability..."

tools=(
  'pdsh'
'qtscxml'
'gtranslator'
'supabase-mcp-server'
'pgxnclient'
'qtconnectivity'
'cpr'
'mjml'
'dockerfmt'
'sloc'
'avro-cpp'
'm1ddc'
'zsv'
'cpio'
'libshumate'
'pgsync'
'osm-pbf'
'jid'
'msc-generator'
'dotbot'
'moon-buggy'
'rhino'
'docker-gen'
'gitlint'
'kondo'
'qtsensors'
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
