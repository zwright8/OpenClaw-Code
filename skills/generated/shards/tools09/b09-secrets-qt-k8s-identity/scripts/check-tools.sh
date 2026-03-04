#!/usr/bin/env bash
set -euo pipefail

echo "Skill: b09-secrets-qt-k8s-identity"
echo "Checking tool availability..."

tools=(
  'teller'
'shntool'
'qtcharts'
'qtserialport'
'moarvm'
'gnome-online-accounts'
'texi2html'
'google-authenticator-libpam'
'atool'
'pandocomatic'
'gl2ps'
'gnunet'
'libspelling'
'qtspeech'
'libnatpmp'
'markdown-toc'
'docx2txt'
'libcec'
'hfsutils'
'airshare'
'ortp'
'kapp'
'qtremoteobjects'
'iconsur'
'kubergrunt'
'libolm'
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
