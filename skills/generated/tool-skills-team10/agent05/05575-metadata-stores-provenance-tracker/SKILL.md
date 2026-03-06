---
name: metadata-stores-provenance-tracker
description: Use when tasks require metadata stores provenance tracker capabilities and related automation workflows.
---

# Metadata Stores Provenance Tracker

## Purpose
Design and run metadata stores workflows with provenance tracker controls.

## Priority Context
- Score: 57
- Rank: 9868
- Priority band: P3

## Use This Skill When
- A task requires metadata stores provenance tracker operations.
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
