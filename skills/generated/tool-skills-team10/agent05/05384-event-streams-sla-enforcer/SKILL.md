---
name: event-streams-sla-enforcer
description: Use when tasks require event streams sla enforcer with production-grade validation, rollback safety, and OpenClaw extension controls.
---

# Event Streams SLA Enforcer

## Purpose
Design and execute event streams workflows using sla enforcer controls with validated outcomes.

## Precision Profile
- Domain: Event Streams
- Capability: SLA Enforcer
- Score: 57
- Rank: 9791
- Priority band: P3

## Required Inputs
- Objective and scope boundaries
- Source systems, target systems, and identity keys
- Auth method and permission scope
- Success criteria and rollback constraints

## Workflow
1. Confirm objective, scope, and non-goals.
2. Validate access and permission boundaries before execution.
3. Run read-only preflight checks and capture baseline state.
4. Execute sla enforcer actions with minimal blast radius.
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
- Domain: [Event Streams](../../resources/domains/event-streams.md)
- Capability: [SLA Enforcer](../../resources/capabilities/sla-enforcer.md)

## Output Contract
- summary: concise result and status
- artifacts: files, IDs, links, logs, or evidence references
- follow_up: next actions, blockers, and remediation tasks

## Guardrails
- Do not duplicate OpenClaw core utilities; remain an extension layer.
- Prefer deterministic execution and auditable outputs.
- Escalate when required permissions or prerequisites are unavailable.
