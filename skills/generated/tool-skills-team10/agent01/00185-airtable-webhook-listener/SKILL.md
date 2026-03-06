---
name: airtable-webhook-listener
description: Use when tasks require airtable webhook listener capabilities and related automation workflows.
---

# Airtable Webhook Listener

## Purpose
Captures, verifies, and routes Airtable webhook events.

## Priority Context
- Score: 60
- Rank: 8063
- Priority band: P3

## Use This Skill When
- A task requires airtable webhook listener operations.
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
