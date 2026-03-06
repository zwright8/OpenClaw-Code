  #!/usr/bin/env bash
  set -euo pipefail

  echo "Skill: b07-shell-search-sync-build"
  echo "Checking tool availability..."

  tools=(
    'ffind'
'autopep8'
'sdcc'
'onedrive-cli'
'dune'
'macos-trash'
'zimfw'
'b3sum'
'arcade-learning-environment'
'manticoresearch'
'httptap'
'aiven-client'
'gtksourceview5'
'multitail'
'ab-av1'
'xdg-ninja'
'tika'
'yoke'
'llgo'
'rizin'
'mac-cleanup-go'
'mbedtls@2'
'md2pdf'
'chawan'
'cfr-decompiler'
'nlopt'
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
