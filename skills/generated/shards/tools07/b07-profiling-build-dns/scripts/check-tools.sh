  #!/usr/bin/env bash
  set -euo pipefail

  echo "Skill: b07-profiling-build-dns"
  echo "Checking tool availability..."

  tools=(
    'aribb24'
'nanopb'
'git-trim'
'rsgain'
'tracy'
'opencl-headers'
'bowtie2'
'autopsy'
'west'
'enex2notion'
'progress'
'ifstat'
'earthly'
'gtkmm4'
'csshx'
'q'
'goctl'
'codecov-cli'
'bundler-completion'
'makeself'
'networkit'
'ragel'
'compiledb'
'eget'
'gpa'
'gnome-builder'
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
