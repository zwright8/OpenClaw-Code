  #!/usr/bin/env bash
  set -euo pipefail

  echo "Skill: b07-ai-container-geo-cli"
  echo "Checking tool availability..."

  tools=(
    'trzsz-ssh'
'tgpt'
'oxker'
'rasterio'
'apngasm'
'h2'
'rbenv-gemset'
'shtool'
'rrdtool'
'hercules'
'libxfixes'
'clarinet'
'i2pd'
'imgproxy'
'fail2ban'
'context7-mcp'
'bkmr'
'weaviate'
'cri-tools'
'liquidctl'
'metis'
'ipv6calc'
'jqp'
'catimg'
'beancount'
'quicktype'
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
