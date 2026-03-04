#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b09-governance-k8s-docs-observability"
echo "Checking tool availability..."

tools=(
  'go-critic'
'man2html'
'standardebooks'
'screenpipe'
'kubecfg'
'amfora'
'joshuto'
'aws-c-http'
'c'
'so'
'docmd'
'xtensor'
'beancount-language-server'
'libserialport'
'goocanvas'
'rdap'
'direwolf'
'liboqs'
'fobis'
'libharu'
'keepassc'
'git-tools'
'gnu-chess'
'cbmc'
'martin'
'scdoc'
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
