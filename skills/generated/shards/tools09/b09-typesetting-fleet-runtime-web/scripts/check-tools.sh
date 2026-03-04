#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b09-typesetting-fleet-runtime-web"
echo "Checking tool availability..."

tools=(
  'sile'
'fleet-cli'
'primesieve'
'ata'
'drogon'
'humanlog'
'ipinfo-cli'
'kraken2'
'plplot'
'libxinerama'
'wiremock-standalone'
'gtkspell3'
'makedepend'
'lockrun'
'certigo'
'fs-uae'
'mpremote'
'anyquery'
'gnome-papers'
'cloudfoundry-cli'
'libgda'
'kbld'
'clojurescript'
'hashlink'
'qtlanguageserver'
'multimarkdown'
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
