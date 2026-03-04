  #!/usr/bin/env bash
  set -euo pipefail

  echo "Skill: b07-system-analysis-netsec"
  echo "Checking tool availability..."

  tools=(
    'acpica'
'termscp'
'profanity'
'sha3sum'
'grunt-cli'
'libical'
'cscope'
'flann'
'container-structure-test'
'psalm'
'glslviewer'
'argyll-cms'
'visp'
'fzy'
'editorconfig-checker'
'naabu'
'fdroidserver'
'epubcheck'
'libvmaf'
'cling'
'cloudquery'
'mafft'
'bmake'
'libclc'
'itk'
'pdns'
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
