---
name: cloud-infra-finops-toolkit
description: Manage cloud infrastructure lifecycle and spend controls. Use when importing existing infra to Terraform, estimating costs, cleaning stale resources, rotating cloud credentials, or operating AWS/OpenStack/Render/B2 environments.
---

# Cloud Infra FinOps Toolkit

Use this skill for cloud estate control loops: discover/import, price, deploy, and clean up.

## Workflow Router

- Need IaC import/normalization -> terraformer + terraform-ls path.
- Need spend/risk checks before apply -> infracost path.
- Need account cleanup or credential refresh -> aws-nuke/cloud-nuke/gimme-aws-creds path.

## Playbook 1: Import existing resources into Terraform

1. Generate Terraform config from live infrastructure.
1. Review generated state/config and normalize modules.
1. Run validation and plan.

Command starters:
```bash
terraformer import aws --resources=vpc,ec2 --regions=<region>
terraform fmt -recursive
terraform validate
```

## Playbook 2: Estimate and gate infrastructure cost

1. Run diff-based estimate before merge/deploy.
1. Highlight services with outsized monthly delta.
1. Block release until spend owners approve.

Command starters:
```bash
infracost breakdown --path .
infracost diff --path . --compare-to /tmp/base.json
```

## Playbook 3: Credential and cleanup operations

1. Acquire short-lived cloud credentials.
1. Execute scoped cleanup in test accounts only.
1. Verify remaining assets via provider CLIs.

Command starters:
```bash
gimme-aws-creds
aws-nuke --config nuke-config.yml --no-dry-run
render services list
```

## Tool Inventory Reference

- Read `references/tool-map.csv` for the full rank-mapped tool list for this workflow cluster.
- Read `references/tool-notes.md` for quick top-tool guidance.
- Prefer tools already installed locally before suggesting new installs.

## Completion Checklist

- Confirm objective, scope, and target environment before running commands.
- Execute smallest safe test first, then expand to full workflow.
- Capture outputs (logs, reports, artifacts) and summarize follow-up actions.
