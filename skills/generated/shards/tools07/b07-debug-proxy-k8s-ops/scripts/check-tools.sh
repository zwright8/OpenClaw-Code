  #!/usr/bin/env bash
  set -euo pipefail

  echo "Skill: b07-debug-proxy-k8s-ops"
  echo "Checking tool availability..."

  tools=(
    'aarch64-elf-gdb'
'mcp-proxy'
'rsyslog'
'tofuenv'
'gprof2dot'
'msgpack'
'datafusion'
'boxes'
'sdl2_net'
'backgroundremover'
'react-native-cli'
'qmmp'
'py-spy'
'faad2'
'sambamba'
'datalad'
'connect'
'libxft'
'secp256k1'
'nuitka'
'phpbrew'
'egctl'
'faust'
'libosinfo'
'libpq@16'
'cargo-udeps'
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
