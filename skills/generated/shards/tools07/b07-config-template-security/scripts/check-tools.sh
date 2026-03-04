  #!/usr/bin/env bash
  set -euo pipefail

  echo "Skill: b07-config-template-security"
  echo "Checking tool availability..."

  tools=(
    'vals'
'nsnake'
'gexiv2'
'minijinja-cli'
'nanorc'
'nest'
'cdrdao'
'cloudflare-cli4'
'jsrepo'
'yara-x'
'crunch'
'translate-toolkit'
'timidity'
'dnsperf'
'moc'
'evtx'
'lazyssh'
'fclones'
'container-compose'
'awsdac'
'omnara'
'helmify'
'ascii'
'hivemind'
'igv'
'wasmedge'
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
