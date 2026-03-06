#!/usr/bin/env bash
set -euo pipefail

echo 'Skill: b04-docs-content-publishing'
echo 'Checking mapped command availability...'

items=(
  'pdfly|pdfly'
  'mailhog|mailhog'
  'swaks|swaks'
  'navi|navi'
  'pdf2svg|pdf2svg'
  'redocly-cli|redocly-cli'
  'latexindent|latexindent'
  'mdbook|mdbook'
  'mu|mu'
  'tinymist|tinymist'
  'pdfcpu|pdfcpu'
  'mkdocs|mkdocs'
  'evince|evince'
  'twine|twine'
  'xpdf|xpdf'
  'nb|nb'
  'copier|copier'
  'help2man|help2man'
  'gcalcli|gcalcli'
  'pngpaste|pngpaste'
  'usage|usage'
  'cheat|cheat'
  'toilet|toilet'
  'mailutils|mailutils'
  'mkdocs-material|mkdocs-material'
  'presenterm|presenterm'
  'antiword|antiword'
  'aha|aha'
  'ical-buddy|ical-buddy'
  'biber|biber'
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
