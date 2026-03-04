  #!/usr/bin/env bash
  set -euo pipefail

  echo "Skill: b07-remote-runtime-infra"
  echo "Checking tool availability..."

  tools=(
    'x11vnc'
'passenger'
'dbml-cli'
'clusterawsadm'
'pkgx'
'ppsspp'
'jags'
'spek'
'otree'
'enscript'
'tty-clock'
'psgrep'
'base64'
'rofi'
'mozjpeg'
'fiona'
'rhash'
'aqbanking'
'opus-tools'
'tfcmt'
'atlantis'
'qtgrpc'
'go-size-analyzer'
'easy-tag'
'cpputest'
'zim'
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
