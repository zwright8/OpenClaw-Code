---
name: public-health-dashboards-quality-gatekeeper
description: Use when tasks require public health dashboards quality gatekeeper capabilities and related automation workflows.
---

# Public Health Dashboards Quality Gatekeeper

## Purpose
Design and run public health dashboards workflows with quality gatekeeper controls.

## Priority Context
- Score: 73
- Rank: 3676
- Priority band: P3

## Use This Skill When
- A task requires public health dashboards quality gatekeeper operations.
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
