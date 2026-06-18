---
name: u0610-security-risk-aware-scheduler
description: Build and operate the "Security Risk-Aware Scheduler" capability for Security and Privacy. Trigger when this exact capability is needed in mission execution.
---

# Security Risk-Aware Scheduler

## Why This Skill Exists
We need this skill because production autonomy must default to least privilege and strong privacy. This specific skill times execution based on risk posture instead of urgency alone.

## When To Use
Use this skill when the request explicitly needs "Security Risk-Aware Scheduler" outcomes in the Security and Privacy domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Security Risk-Aware Scheduler`, including at least three measurable KPIs tied to breach, exfiltration, and over-privileged actions.
2. Design and version the input/output contract for permissions, sensitive data flows, and threat events, then add schema validation and failure-mode handling.
3. Implement the core capability using risk-weighted sequencing, and produce risk-gated schedules with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover breach, exfiltration, and over-privileged actions, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Runtime profile: planning-router using risk-weighted sequencing to produce risk-gated schedules.
- Orchestration integration: security-and-privacy:planning-router routing, approval gates, retries, and rollback controls.
- Validation evidence: unit, integration, simulation, regression-baseline suites and rollout telemetry.

## Operational Runbook
### Preflight
- Confirm the Security Risk-Aware Scheduler request scope, source evidence, and measurable success criteria before execution.
- Verify feature flag skill_0610_security-risk-aware-scheduler, approval gates, and rollback owner before autonomous use.

### Execution
- Execute risk-weighted sequencing with deterministic scoring and reproducible trace capture.
- Produce risk-gated schedules plus scorecard, assumptions, and unresolved-risk notes.

### Recovery
- Fail closed when required signals, evidence, or approval gates are missing.
- Rollback to the last stable baseline when posture is critical or validation fails.

### Handoff
- Publish risk-gated schedules, validation evidence, and telemetry links to downstream owners.
- Queue follow-up tasks for unresolved risks, threshold tuning, or approval review.

## Guardrails
- [quality] Require deterministic scoring and validation evidence before promotion.
- [reliability] Preserve retries, rollback controls, and failure-mode evidence for every run.
- [safety] Route critical posture or missing approval gates to human review before autonomous action.
