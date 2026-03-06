#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b10-java-graphql-monitoring"
echo "Checking tool availability..."

tools=(
  'dtrx'
  'jabba'
  'gtree'
  'rdb'
  'ansiweather'
  'glassfish'
  'cabin'
  'fernflower'
  'rbtools'
  'graphql-cli'
  'rawdog'
  'cryptominisat'
  'parallel-disk-usage'
  'sail'
  'tabulate'
  'bedops'
  'mdp'
  'pyinvoke'
  'apcupsd'
  'ginac'
  'fricas'
  'alloy-analyzer'
  'gopass-jsonapi'
  'nagios'
  'bigloo'
  'gnu-prolog'
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
