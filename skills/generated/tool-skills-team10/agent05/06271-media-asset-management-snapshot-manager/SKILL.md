---
name: media-asset-management-snapshot-manager
description: Use when tasks require media asset management snapshot manager capabilities and related automation workflows.
---

# Media Asset Management Snapshot Manager

## Purpose
Design and run media asset management workflows with snapshot manager controls.

## Priority Context
- Score: 61
- Rank: 7979
- Priority band: P3

## Use This Skill When
- A task requires media asset management snapshot manager operations.
- You need a repeatable workflow that combines planning, execution, and validation.
- You want to integrate external tools while keeping OpenClaw core behavior unchanged.

## Workflow
1. Define objective, scope, and expected outputs.
2. Perform auth/session checks and confirm required permissions.
3. Execute smallest valid operation first (read-only where possible).
4. Expand to write operations with explicit validation and rollback plan.
5. Capture artifacts, logs, and next actions for handoff.

## Safety Rules
- Do not duplicate OpenClaw core utilities; use extension-layer wrappers only.
- Enforce least privilege and redact sensitive values in logs.
- Validate side effects before marking tasks complete.

## Output Contract
- summary: concise result and status
- artifacts: files, links, or IDs generated
- follow_up: next steps or blockers
