#!/usr/bin/env bash
set -euo pipefail

echo 'Skill: b04-system-observability-hardware'
echo 'Checking mapped command availability...'

items=(
  'tailspin|tailspin'
  'usbutils|usbutils'
  'valgrind|valgrind'
  'sleepwatcher|sleepwatcher'
  'goaccess|goaccess'
  'logstash|logstash'
  'asitop|asitop'
  'gperftools|gperftools'
  'snap|snap'
  'retry|retry'
  'sane-backends|sane-backends'
  'grc|grc'
  'macmon|macmon'
  'vivid|vivid'
  'flock|flock'
  'xorriso|xorriso'
  'hyfetch|hyfetch'
  'hl|hl'
  'file-formula|file-formula'
  'socket_vmnet|socket_vmnet'
  'hexyl|hexyl'
  'crowdin|crowdin'
  'uhd|uhd'
  'lesspipe|lesspipe'
  'pcsc-lite|pcsc-lite'
  'sniffnet|sniffnet'
  'm-cli|m-cli'
  'systemd|systemd'
  'newrelic-infra-agent|newrelic-infra-agent'
  'mecab-ipadic|mecab-ipadic'
  'brightness|brightness'
  'bandwhich|bandwhich'
  'hyperkit|hyperkit'
  'muffet|muffet'
  'sysbench|sysbench'
  'kanata|kanata'
  'batt|batt'
  'vfkit|vfkit'
  'axel|axel'
  'gsmartcontrol|gsmartcontrol'
  'bloaty|bloaty'
  'bpytop|bpytop'
  'wget2|wget2'
  'duplicity|duplicity'
  'filebeat|filebeat'
  'inxi|inxi'
  'kopia|kopia'
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
