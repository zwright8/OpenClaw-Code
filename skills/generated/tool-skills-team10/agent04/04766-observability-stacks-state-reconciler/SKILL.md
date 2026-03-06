---
name: observability-stacks-state-reconciler
description: Use when tasks require observability stacks state reconciler capabilities and related automation workflows.
---

# Observability Stacks State Reconciler

## Purpose
Design and run observability stacks workflows with state reconciler controls.

## Priority Context
- Score: 77
- Rank: 2386
- Priority band: P2

## Use This Skill When
- A task requires observability stacks state reconciler operations.
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
