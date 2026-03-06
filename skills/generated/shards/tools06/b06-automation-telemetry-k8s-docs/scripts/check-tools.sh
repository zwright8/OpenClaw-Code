#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b06-automation-telemetry-k8s-docs"
echo "Checking tool availability..."

tools=(
  'flexget'
  'opentelemetry-cpp'
  'unicorn'
  'ytt'
  'libftdi'
  'mage'
  'fig2dev'
  'sqruff'
  'whisperkit-cli'
  'gpg-tui'
  'desktop-file-utils'
  'opusfile'
  'mmctl'
  'opencolorio'
  'git-spice'
  'chapel'
  'wasmer'
  'tomcat@8'
  'kubernetes-cli@1.31'
  'libopenmpt'
  'bwa'
  'latexml'
  'claude-code-router'
  'robot-framework'
  'trunk'
  'mq'
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
