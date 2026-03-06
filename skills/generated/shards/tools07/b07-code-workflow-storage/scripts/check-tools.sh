  #!/usr/bin/env bash
  set -euo pipefail

  echo "Skill: b07-code-workflow-storage"
  echo "Checking tool availability..."

  tools=(
    'jython'
'joern'
'utf8cpp'
'go-jira'
'simple-tiles'
'dagu'
'agda'
'qca'
'libnice-gstreamer'
'dolphie'
'fzf-make'
'imap-backup'
'qbs'
'chkrootkit'
'payload-dumper-go'
'regal'
'dosfstools'
'spice-protocol'
'otel-cli'
'ansible@10'
'px'
'adios2'
'silicon'
'typos-lsp'
'djvu2pdf'
'fox'
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
