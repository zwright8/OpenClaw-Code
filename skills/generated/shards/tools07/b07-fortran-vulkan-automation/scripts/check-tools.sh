  #!/usr/bin/env bash
  set -euo pipefail

  echo "Skill: b07-fortran-vulkan-automation"
  echo "Checking tool availability..."

  tools=(
    'libtirpc'
'fpm'
'spotbugs'
'vulkan-volk'
'unrtf'
'enca'
'anycable-go'
'comby'
'osc'
'ralph-orchestrator'
'ispc'
'vulkan-utility-libraries'
'openfpgaloader'
'xauth'
'erdtree'
'jbig2enc'
'gnu-typist'
'xvid'
'slides'
'licensefinder'
'turso'
'inotify-tools'
'frps'
'tkdiff'
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
