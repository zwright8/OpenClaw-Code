  #!/usr/bin/env bash
  set -euo pipefail

  echo "Skill: b07-data-protocol-db-runtime"
  echo "Checking tool availability..."

  tools=(
    'proxygen'
'ada-url'
'hdf5-mpi'
'mariadb@10.5'
'mariadb@11.4'
'libelf'
'xlsxio'
'baresip'
'ghz'
'meta-package-manager'
'xapian'
'hstr'
'pg_cron'
'swift-outdated'
'autocorrect'
'pycodestyle'
'rbw'
'liblo'
'gnirehtet'
'chrony'
'ncview'
'dcm2niix'
'wxwidgets@3.2'
'defaultbrowser'
'avro-c'
'diesel'
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
