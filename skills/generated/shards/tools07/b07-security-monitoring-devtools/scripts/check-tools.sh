  #!/usr/bin/env bash
  set -euo pipefail

  echo "Skill: b07-security-monitoring-devtools"
  echo "Checking tool availability..."

  tools=(
    'grails'
'sql-formatter'
'python-gdbm@3.13'
'pip-audit'
'breezy'
'zenith'
'hamlib'
'dcraw'
'util-macros'
'kumactl'
'shc'
'psysh'
'ducker'
'ghex'
'fastp'
'gpredict'
'gptme'
'nip4'
'riff'
'libdmtx'
'virustotal-cli'
'mbpoll'
'swc'
'ni'
'csvtk'
'xmlto'
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
