#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b08-db-messaging-build-release"
echo "Checking tool availability..."

tools=(
  'glaze'
  'libxdmcp'
  'mongoose'
  'clip'
  'frotz'
  'pg_partman'
  'azure-dev'
  'spirv-cross'
  'cataclysm'
  's-search'
  'stormy'
  'lld@19'
  'pulsarctl'
  'pgweb'
  'toxiproxy'
  'netatalk'
  'archey4'
  'apt-dater'
  'ansible-builder'
  'aws-c-io'
  'bazel-diff'
  'sqlparse'
  'ejabberd'
  'docker-squash'
  'fnox'
  'bump-my-version'
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
