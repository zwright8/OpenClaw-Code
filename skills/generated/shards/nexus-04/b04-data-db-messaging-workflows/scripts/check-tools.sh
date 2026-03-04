#!/usr/bin/env bash
set -euo pipefail

echo 'Skill: b04-data-db-messaging-workflows'
echo 'Checking mapped command availability...'

items=(
  'lapack|lapack'
  'pocketbase|pocketbase'
  'blast|blast'
  'imapsync|imapsync'
  'xq|xq'
  'bruno-cli|bruno-cli'
  'libdap|libdap'
  'postgrest|postgrest'
  'ledger|ledger'
  'mdbtools|mdbtools'
  'cjson|cjson'
  'xan|xan'
  'calc|calc'
  'mcp-toolbox|mcp-toolbox'
  'csvlens|csvlens'
  'petsc|petsc'
  'cfitsio|cfitsio'
  'npm-check-updates|npm-check-updates'
  'bcftools|bcftools'
  'json-c|json-c'
  'redis@6.2|redis-server'
  'posting|posting'
  'cypher-shell|cypher-shell'
  'jc|jc'
  'harlequin|harlequin'
  'mmseqs2|mmseqs2'
  'influxdb-cli|influxdb-cli'
  'avro-tools|avro-tools'
  'rover|rover'
  'contentful-cli|contentful-cli'
  'rainfrog|rainfrog'
  'curlie|curlie'
  'scip|scip'
  'oauth2l|oauth2l'
  'rqlite|rqlite'
  'newman|newman'
  'cbc|cbc'
  'homebank|homebank'
  'activemq|activemq'
  'snakemake|snakemake'
  'molecule|molecule'
  'psqlodbc|psqlodbc'
)
found=0
missing=0
for item in "${items[@]}"; do
  tool=${item%%|*}
  cmd=${item##*|}
  if command -v "$cmd" >/dev/null 2>&1; then
    printf '[FOUND]   %-28s -> %-16s (%s)\n' "$tool" "$cmd" "$(command -v "$cmd")"
    found=$((found+1))
  else
    printf '[MISSING] %-28s -> %s\n' "$tool" "$cmd"
    missing=$((missing+1))
  fi
done

echo
echo "Found mappings: $found"
echo "Missing mappings: $missing"
