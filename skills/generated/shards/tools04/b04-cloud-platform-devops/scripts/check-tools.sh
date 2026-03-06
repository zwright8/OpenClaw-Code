#!/usr/bin/env bash
set -euo pipefail

echo 'Skill: b04-cloud-platform-devops'
echo 'Checking mapped command availability...'

items=(
  'apko|apko'
  'balena-cli|balena-cli'
  'tf-summarize|tf-summarize'
  'ko|ko'
  'scw|scw'
  'kops|kops'
  'awscli@1|aws'
  'kubetail|kubetail'
  'faas-cli|faas-cli'
  'steampipe|steampipe'
  'aws-sso-util|aws-sso-util'
  'gifski|gifski'
  'atmos|atmos'
  'x265|x265'
  'rav1e|rav1e'
  'cog|cog'
  'snapcraft|snapcraft'
  'terramate|terramate'
  'tektoncd-cli|tektoncd-cli'
  'incus|incus'
  'aws-sso-cli|aws-sso-cli'
  'tgenv|tgenv'
  'pcl|pcl'
  'terrascan|terrascan'
  'devspace|devspace'
  'kubecm|kubecm'
  'cdktf|cdktf'
  'copilot|copilot'
  'coder|coder'
  'testkube|testkube'
  'nerdctl|nerdctl'
  'aws-shell|aws-shell'
  'pluto|pluto'
  'awslogs|awslogs'
  'git-remote-codecommit|git-remote-codecommit'
  'vcluster|vcluster'
  'ocicl|ocicl'
  'terraform-local|terraform-local'
  'copa|copa'
  'traefik|traefik'
  'dnscontrol|dnscontrol'
  'kubeshark|kubeshark'
  'helm-ls|helm-ls'
  'podman-tui|podman-tui'
  'linode-cli|linode-cli'
  'calicoctl|calicoctl'
  'chart-testing|chart-testing'
  'awsume|awsume'
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
