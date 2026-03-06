---
name: property-management-reliability-scorer
description: Use when tasks require property management reliability scorer capabilities and related automation workflows.
---

# Property Management Reliability Scorer

## Purpose
Design and run property management workflows with reliability scorer controls.

## Priority Context
- Score: 57
- Rank: 8908
- Priority band: P3

## Use This Skill When
- A task requires property management reliability scorer operations.
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
