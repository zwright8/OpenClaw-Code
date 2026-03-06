  #!/usr/bin/env bash
  set -euo pipefail

  echo "Skill: b07-db-k8s-firmware-observability"
  echo "Checking tool availability..."

  tools=(
    'algol68g'
'berkeley-db@4'
'libgr'
'pgbouncer'
'pqiv'
'simg2img'
'fwup'
'neovim-qt'
'verapdf'
'libmtp'
'etcd-cpp-apiv3'
'pkcs11-tools'
't-rec'
'commandbox'
'mesa-glu'
'kube-bench'
'node-red'
'kubernetes-cli@1.30'
'cf2tf'
'quilt'
'fortls'
'imageoptim-cli'
'metview'
'victoriametrics'
'logdy'
'gptline'
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
