  #!/usr/bin/env bash
  set -euo pipefail

  echo "Skill: b07-gitops-k8s-data"
  echo "Checking tool availability..."

  tools=(
    'argocd-autopilot'
'npq'
'drone-cli'
'osmcoastline'
'subnetcalc'
'gitoxide'
'python-tabulate'
'popeye'
'qtwebengine'
'nyancat'
'hive'
'arm-none-eabi-binutils'
'powerline-go'
'liblqr'
'zipkin'
'tidy-viewer'
'azqr'
'idris2'
'lanraragi'
'hexo'
'sipp'
'wgo'
'astrometry-net'
'vulkan-extensionlayer'
'pkcs11-helper'
'cljfmt'
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
