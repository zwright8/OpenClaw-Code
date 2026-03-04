#!/usr/bin/env bash
set -euo pipefail

echo 'Skill: b04-terminal-shell-productivity'
echo 'Checking mapped command availability...'

items=(
  'zsh-history-substring-search|zsh-history-substring-search'
  'wtfutil|wtfutil'
  'zplug|zplug'
  'brew-gem|brew-gem'
  'tcsh|tcsh'
  'ttyd|ttyd'
  'rich-cli|rich-cli'
  'picocom|picocom'
  'irssi|irssi'
  'terminator|terminator'
  'kimi-cli|kimi-cli'
  'virtualenvwrapper|virtualenvwrapper'
  'tmuxp|tmuxp'
  'sesh|sesh'
  'foreman|foreman'
  'zx|zx'
  'mprocs|mprocs'
  'copyparty|copyparty'
  'checkbashisms|checkbashisms'
  'mcfly|mcfly'
  'zsh-fast-syntax-highlighting|zsh-fast-syntax-highlighting'
  'hunspell|hunspell'
  'notmuch|notmuch'
  'pip-tools|pip-tools'
  'mcpm|mcpm'
  'python-argcomplete|python-argcomplete'
  'dockutil|dockutil'
  'brew-php-switcher|brew-php-switcher'
  'autogen|autogen'
  'makensis|makensis'
  'reattach-to-user-namespace|reattach-to-user-namespace'
  'bkt|bkt'
  'sc-im|sc-im'
  'bat-extras|bat-extras'
  'rbenv-bundler|rbenv-bundler'
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
