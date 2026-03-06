#!/usr/bin/env bash
set -euo pipefail

echo 'Skill: b04-git-code-review-release'
echo 'Checking mapped command availability...'

items=(
  'php-code-sniffer|php-code-sniffer'
  'backlog-md|backlog-md'
  'rumdl|rumdl'
  'git-xet|git-xet'
  'diffoscope|diffoscope'
  'codespell|codespell'
  'ctags|ctags'
  'git-cliff|git-cliff'
  'zls|zls'
  'github-mcp-server|github-mcp-server'
  'git-quick-stats|git-quick-stats'
  'gofumpt|gofumpt'
  'gitea|gitea'
  'bash-language-server|bash-language-server'
  'ccls|ccls'
  'flow|flow'
  'jjui|jjui'
  'astyle|astyle'
  'stylelint|stylelint'
  'solargraph|solargraph'
  'git-annex|git-annex'
  'asciidoc|asciidoc'
  'ty|ty'
  'cocogitto|cocogitto'
  'uncrustify|uncrustify'
  'chroma|chroma'
  'taplo|taplo'
  'goimports|goimports'
  'git-cola|git-cola'
  'fop|fop'
  'cpplint|cpplint'
  'buildozer|buildozer'
  'elixir-ls|elixir-ls'
  'pinact|pinact'
  'checkstyle|checkstyle'
  'tombi|tombi'
  'tea|tea'
  'pyrefly|pyrefly'
  'git-absorb|git-absorb'
  'django-completion|django-completion'
  'mergiraf|mergiraf'
  'dprint|dprint'
  'pgformatter|pgformatter'
  'ktfmt|ktfmt'
  'jsonlint|jsonlint'
  'texlab|texlab'
  'vsce|vsce'
  'git-who|git-who'
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
