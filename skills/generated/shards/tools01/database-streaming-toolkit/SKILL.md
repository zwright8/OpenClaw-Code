---
name: database-streaming-toolkit
description: Operate relational, document, key-value, and streaming data systems from CLI. Use when running queries, managing schema versions, inspecting data pipelines, or administering database/message-broker instances.
---

# Database & Streaming Toolkit

## Overview
Query, administer, and troubleshoot core data stores and streaming backplanes.

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
- Run interactive/admin SQL workflows
- Manage local and remote DB clients
- Inspect queue/stream backlogs
- Debug connectivity and auth between apps and data stores

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
