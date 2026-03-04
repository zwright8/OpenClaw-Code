#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b10-media-k8s-encryption-web"
echo "Checking tool availability..."

tools=(
  'mkvdts2ac3'
  'jsonschema2pojo'
  'superlu'
  'ocp'
  'libzzip'
  'mecab-ko-dic'
  'iam-policy-json-to-terraform'
  'pdf-diff'
  'dillo'
  'minizip-ng'
  'vultr'
  'age-plugin-yubikey'
  'urdfdom'
  'shapelib'
  'json5'
  'kwctl'
  'pass-git-helper'
  'claude-code-templates'
  'prism-cli'
  'rage'
  'phive'
  'libdazzle'
  'kubekey'
  'scalingo'
  'sysaidmin'
  'static-web-server'
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
