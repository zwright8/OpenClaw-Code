#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b09-intel-network-policy-quant"
echo "Checking tool availability..."

tools=(
  'censys'
'remarshal'
'libsvg'
'codesnap'
'kea'
'klavaro'
'addons-linter'
'gyb'
'qtlocation'
'qtlottie'
'qcli'
'tmt'
'dockerfilegraph'
'znc'
'rattler-index'
'boring'
'leapp-cli'
'gwenhywfar'
'html-xml-utils'
'elm'
'nyan'
'bbftp-client'
'gforth'
'qthttpserver'
'quantlib'
'lv'
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
