#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAP_FILE="${SCRIPT_DIR}/../references/tool-binaries.tsv"

if [[ ! -f "$MAP_FILE" ]]; then
  echo "tool-binaries.tsv not found: $MAP_FILE" >&2
  exit 1
fi

filter="${1:-}"

while IFS=$'	' read -r tool bins; do
  [[ "$tool" == "tool" ]] && continue
  [[ -z "$tool" ]] && continue

  if [[ -n "$filter" && "$tool" != "$filter" ]]; then
    continue
  fi

  found_cmd=""
  version=""
  IFS=',' read -ra candidates <<< "$bins"
  for cmd in "${candidates[@]}"; do
    [[ -z "$cmd" ]] && continue
    if command -v "$cmd" >/dev/null 2>&1; then
      found_cmd="$cmd"
      version="$($cmd --version 2>/dev/null | head -n 1 || true)"
      if [[ -z "$version" ]]; then
        version="$($cmd -V 2>/dev/null | head -n 1 || true)"
      fi
      break
    fi
  done

  if [[ -n "$found_cmd" ]]; then
    echo "[FOUND] $tool -> $found_cmd ${version}"
  else
    echo "[MISSING] $tool (candidates: $bins)"
  fi
done < "$MAP_FILE"
