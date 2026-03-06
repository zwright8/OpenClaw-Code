#!/usr/bin/env bash
set -euo pipefail

echo 'Skill: b04-security-network-forensics'
echo 'Checking mapped command availability...'

items=(
  'wireguard-go|wireguard-go'
  'signal-cli|signal-cli'
  'git-secrets|git-secrets'
  'tcptraceroute|tcptraceroute'
  'lastpass-cli|lastpass-cli'
  'zrok|zrok'
  'gopass|gopass'
  'libosip|libosip'
  'sleuthkit|sleuthkit'
  'hcxtools|hcxtools'
  'stunnel|stunnel'
  'ldid|ldid'
  'tldx|tldx'
  'rustscan|rustscan'
  'swtpm|swtpm'
  'snort|snort'
  'easy-rsa|easy-rsa'
  'masscan|masscan'
  'ipmitool|ipmitool'
  'hackrf|hackrf'
  'kics|kics'
  'dnscrypt-proxy|dnscrypt-proxy'
  'strongswan|strongswan'
  'infisical|infisical'
  'chamber|chamber'
  'tcping|tcping'
  'gosec|gosec'
  'privoxy|privoxy'
  'zeek|zeek'
  'librtlsdr|librtlsdr'
  'ngrep|ngrep'
  'spoofdpi|spoofdpi'
  'openbao|openbao'
  'pwntools|pwntools'
  'lynis|lynis'
  'spoof-mac|spoof-mac'
  'torsocks|torsocks'
  'trippy|trippy'
  'feroxbuster|feroxbuster'
  'fcrackzip|fcrackzip'
  'knot|knot'
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
