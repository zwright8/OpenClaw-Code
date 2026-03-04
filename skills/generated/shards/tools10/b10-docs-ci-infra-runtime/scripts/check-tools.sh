#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b10-docs-ci-infra-runtime"
echo "Checking tool availability..."

tools=(
  'jsdoc3'
  'aws2-wrap'
  'juicefs'
  'act_runner'
  'forgejo'
  'tock'
  'ompl'
  'wordnet'
  'cassandra-reaper'
  'kallisto'
  'nmail'
  'libgit2-glib'
  'advancecomp'
  'sloth-cli'
  'memray'
  'diskus'
  'pushpin'
  'sceptre'
  'libpeas@1'
  'onednn'
  'pangomm@2.46'
  'qt-unixodbc'
  'roadrunner'
  'ryelang'
  'beanstalkd'
  'nanobot'
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
