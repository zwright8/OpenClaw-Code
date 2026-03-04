#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b10-k8s-proxy-crypto-dotfiles"
echo "Checking tool availability..."

tools=(
  'stuntman'
  'ox'
  'jimtcl'
  'cloudformation-guard'
  'enigma'
  'nqp'
  'lsix'
  'lowdown'
  'run'
  'lhasa'
  'urlscan'
  'filen-cli'
  'cf-terraforming'
  'kubernetes-mcp-server'
  'proxytunnel'
  'sequoia-sq'
  'cppi'
  'dotdrop'
  'kyma-cli'
  'ccrypt'
  'github-release'
  'libgweather'
  'megacmd'
  'freedink'
  'lacework-cli'
  'hatari'
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
