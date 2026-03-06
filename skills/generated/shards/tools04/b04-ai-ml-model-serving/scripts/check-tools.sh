#!/usr/bin/env bash
set -euo pipefail

echo 'Skill: b04-ai-ml-model-serving'
echo 'Checking mapped command availability...'

items=(
  'stockfish|stockfish'
  'localai|localai'
  'llmfit|llmfit'
  'gollama|gollama'
  'echidna|echidna'
  'mogenerator|mogenerator'
  'sentencepiece|sentencepiece'
  'faiss|faiss'
  'vespa-cli|vespa-cli'
  'bitcoin|bitcoin'
  'torchvision|torchvision'
  'langgraph-cli|langgraph-cli'
  'aptos|aptos'
  'mistral-vibe|mistral-vibe'
)
found=0
missing=0
for item in "${items[@]}"; do
  tool=${item%%|*}
  cmd=${item##*|}
  if command -v "$cmd" >/dev/null 2>&1; then
    printf '[FOUND]   %-28s -> %-16s (%s)\n' "$tool" "$cmd" "$(command -v "$cmd")"
    found=$((found+1))
  else
    printf '[MISSING] %-28s -> %s\n' "$tool" "$cmd"
    missing=$((missing+1))
  fi
done

echo
echo "Found mappings: $found"
echo "Missing mappings: $missing"
