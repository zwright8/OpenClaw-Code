---
name: device-labs-schema-introspector
description: Use when tasks require device labs schema introspector with production-grade validation, rollback safety, and OpenClaw extension controls.
---

# Device Labs Schema Introspector

## Purpose
Design and execute device labs workflows using schema introspector controls with validated outcomes.

## Precision Profile
- Domain: Device Labs
- Capability: Schema Introspector
- Score: 87
- Rank: 667
- Priority band: P1

## Required Inputs
- Objective and scope boundaries
- Source systems, target systems, and identity keys
- Auth method and permission scope
- Success criteria and rollback constraints

## Workflow
1. Confirm objective, scope, and non-goals.
2. Validate access and permission boundaries before execution.
3. Run read-only preflight checks and capture baseline state.
4. Execute schema introspector actions with minimal blast radius.
5. Validate outputs against schema, business rules, and side effects.
6. If validation fails, execute rollback/recovery path and re-verify.
7. Capture artifacts, logs, and decision evidence.
8. Return structured status with follow-up actions.

## Validation Checklist
- Input contract validated
- Auth scope confirmed
- Preflight recorded
- Post-execution checks passed
- Sensitive values redacted
- Recovery path tested or documented

## Resources
- Baseline: [TOOL_SKILL_BASELINE.md](../../resources/TOOL_SKILL_BASELINE.md)
- Domain: [Device Labs](../../resources/domains/device-labs.md)
- Capability: [Schema Introspector](../../resources/capabilities/schema-introspector.md)

## Output Contract
- summary: concise result and status
- artifacts: files, IDs, links, logs, or evidence references
- follow_up: next actions, blockers, and remediation tasks

## Guardrails
- Do not duplicate OpenClaw core utilities; remain an extension layer.
- Prefer deterministic execution and auditable outputs.
- Escalate when required permissions or prerequisites are unavailable.
