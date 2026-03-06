#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b08-web-data-mail-security"
echo "Checking tool availability..."

tools=(
  'mariadb-connector-odbc'
  'memtester'
  'gatsby-cli'
  'ccat'
  'mapproxy'
  'mp4v2'
  'ghalint'
  'gnu-apl'
  'parsedmarc'
  'orc'
  'hmmer'
  'dufs'
  'webkitgtk'
  'scdl'
  'mariadb@11.8'
  'python-gdbm@3.12'
  'pianobar'
  'klee'
  'findomain'
  'mcp-atlassian'
  'surfer'
  'macpine'
  'nox'
  'shadowenv'
  'zopfli'
  'rkhunter'
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
