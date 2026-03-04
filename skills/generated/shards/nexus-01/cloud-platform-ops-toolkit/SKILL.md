---
name: cloud-platform-ops-toolkit
description: Operate cloud-provider and SaaS platform CLIs. Use when provisioning or managing resources on AWS/Azure/OCI/DO/Fly/Vercel/Firebase, handling cloud auth, uploading artifacts, or inspecting remote app status.
---

# Cloud Platform Ops Toolkit

## Overview
Handle day-to-day cloud and platform operations across major providers.

Read `references/tool-matrix.md` to choose the best tool by rank/adoption and fallback options.
Read `references/command-recipes.md` for validated command starters.
Run `scripts/check-installed.sh` to detect availability and versions before execution.

## Workflow
1. Define the exact outcome and constraints.
2. Select a primary tool and one fallback from `references/tool-matrix.md`.
3. Verify installation with `bash scripts/check-installed.sh <tool>`.
4. Start from the closest recipe in `references/command-recipes.md` and adapt flags/paths.
5. Validate output and capture command + result in your task notes.

## Common task categories
- Authenticate and assume cloud identities
- Inspect and mutate cloud resources
- Deploy serverless/apps to managed platforms
- Transfer artifacts and data

## Safety guardrails
- Prefer read-only or dry-run modes before apply/delete operations.
- Scope commands narrowly (specific files, namespaces, or resources).
- Avoid destructive flags unless explicitly required by the task.
- Capture stderr/stdout for troubleshooting and reproducibility.

## Fast checks
```bash
bash scripts/check-installed.sh
bash scripts/check-installed.sh <tool-name>
```
