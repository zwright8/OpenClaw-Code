#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b08-analytics-security-genomics"
echo "Checking tool availability..."

tools=(
  'druid'
  'synergy-core'
  'spacer'
  'vunnel'
  'mimalloc'
  'tarantool'
  'scoutsuite'
  'argc'
  'httpstat'
  'vcftools'
  'proctools'
  'wildfly-as'
  'openkim-models'
  'mdfried'
  'genometools'
  'sqlpage'
  'cc65'
  'datamash'
  'llvm@12'
  'libre'
  'tintin'
  'evans'
  'bosh-cli'
  'playwright-cli'
  'mongo-cxx-driver'
  'mlpack'
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
