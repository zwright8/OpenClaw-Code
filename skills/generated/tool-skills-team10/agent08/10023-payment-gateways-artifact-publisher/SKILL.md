---
name: payment-gateways-artifact-publisher
description: Use when tasks require payment gateways artifact publisher with production-grade validation, rollback safety, and OpenClaw extension controls.
---

# Payment Gateways Artifact Publisher

## Purpose
Design and execute payment gateways workflows using artifact publisher controls with validated outcomes.

## Precision Profile
- Domain: Payment Gateways
- Capability: Artifact Publisher
- Score: 57
- Rank: 11484
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
4. Execute artifact publisher actions with minimal blast radius.
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
- Domain: [Payment Gateways](../../resources/domains/payment-gateways.md)
- Capability: [Artifact Publisher](../../resources/capabilities/artifact-publisher.md)

## Output Contract
- summary: concise result and status
- artifacts: files, IDs, links, logs, or evidence references
- follow_up: next actions, blockers, and remediation tasks

## Guardrails
- Do not duplicate OpenClaw core utilities; remain an extension layer.
- Prefer deterministic execution and auditable outputs.
- Escalate when required permissions or prerequisites are unavailable.
