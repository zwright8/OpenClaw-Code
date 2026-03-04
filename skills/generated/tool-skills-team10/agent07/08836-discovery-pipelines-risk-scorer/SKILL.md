---
name: discovery-pipelines-risk-scorer
description: Use when tasks require discovery pipelines risk scorer with production-grade validation, rollback safety, and OpenClaw extension controls.
---

# Discovery Pipelines Risk Scorer

## Purpose
Design and execute discovery pipelines workflows using risk scorer controls with validated outcomes.

## Precision Profile
- Domain: Discovery Pipelines
- Capability: Risk Scorer
- Score: 81
- Rank: 1649
- Priority band: P2

## Required Inputs
- Objective and scope boundaries
- Source systems, target systems, and identity keys
- Auth method and permission scope
- Success criteria and rollback constraints

## Workflow
1. Confirm objective, scope, and non-goals.
2. Validate access and permission boundaries before execution.
3. Run read-only preflight checks and capture baseline state.
4. Execute risk scorer actions with minimal blast radius.
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
- Domain: [Discovery Pipelines](../../resources/domains/discovery-pipelines.md)
- Capability: [Risk Scorer](../../resources/capabilities/risk-scorer.md)

## Output Contract
- summary: concise result and status
- artifacts: files, IDs, links, logs, or evidence references
- follow_up: next actions, blockers, and remediation tasks

## Guardrails
- Do not duplicate OpenClaw core utilities; remain an extension layer.
- Prefer deterministic execution and auditable outputs.
- Escalate when required permissions or prerequisites are unavailable.
