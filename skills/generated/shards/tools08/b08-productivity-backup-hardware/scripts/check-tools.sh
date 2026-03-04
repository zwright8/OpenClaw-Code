#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b08-productivity-backup-hardware"
echo "Checking tool availability..."

tools=(
  'kargo'
  'mcat'
  'threadweaver'
  'organize-tool'
  'calcurse'
  'noti'
  'pcb2gcode'
  'mcp-grafana'
  'gifify'
  'vbindiff'
  'po4a'
  'apache-opennlp'
  'codebook-lsp'
  'youplot'
  'argp-standalone'
  'todoist-cli'
  'watson'
  'brpc'
  'percona-xtrabackup@8.0'
  'htmldoc'
  'arrayfire'
  'pixz'
  'lm-sensors'
  'crystalline'
  'git-interactive-rebase-tool'
  'pianod'
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
