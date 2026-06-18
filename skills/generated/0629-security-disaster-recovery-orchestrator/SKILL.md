---
name: u0629-security-disaster-recovery-orchestrator
description: Build and operate the "Security Disaster Recovery Orchestrator" capability for Security and Privacy. Trigger when this exact capability is needed in mission execution.
---

# Security Disaster Recovery Orchestrator

## Why This Skill Exists
We need this skill because production autonomy must default to least privilege and strong privacy. This specific skill improves recovery speed after severe outages.

## When To Use
Use this skill when the request explicitly needs "Security Disaster Recovery Orchestrator" outcomes in the Security and Privacy domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Security Disaster Recovery Orchestrator`, including at least three measurable KPIs tied to breach, exfiltration, and over-privileged actions.
2. Design and version the input/output contract for permissions, sensitive data flows, and threat events, then add schema validation and failure-mode handling.
3. Implement the core capability using failover and restoration sequencing, and produce recovery mission plans with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover breach, exfiltration, and over-privileged actions, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Runtime profile: general-capability using failover and restoration sequencing to produce recovery mission plans.
- Orchestration integration: security-and-privacy:general-capability routing, approval gates, retries, and rollback controls.
- Validation evidence: unit, integration, simulation, regression-baseline suites and rollout telemetry.

## Operational Runbook
### Preflight
- Confirm the Security Disaster Recovery Orchestrator request scope, source evidence, and measurable success criteria before execution.
- Verify feature flag skill_0629_security-disaster-recovery-orche, approval gates, and rollback owner before autonomous use.

### Execution
- Execute failover and restoration sequencing with deterministic scoring and reproducible trace capture.
- Produce recovery mission plans plus scorecard, assumptions, and unresolved-risk notes.

### Recovery
- Fail closed when required signals, evidence, or approval gates are missing.
- Rollback to the last stable baseline when posture is critical or validation fails.

### Handoff
- Publish recovery mission plans, validation evidence, and telemetry links to downstream owners.
- Queue follow-up tasks for unresolved risks, threshold tuning, or approval review.

## Guardrails
- [quality] Require deterministic scoring and validation evidence before promotion.
- [reliability] Preserve retries, rollback controls, and failure-mode evidence for every run.
- [safety] Route critical posture or missing approval gates to human review before autonomous action.
