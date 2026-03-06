---
name: openclaw-0170-risk-weighted-sequencing
description: Governance Risk-Aware Scheduler. Use when work requires risk-weighted sequencing for Safety and Governance with guardrails, traceable execution, and measurable outcomes.
---

# Governance Risk-Aware Scheduler

## Mission
We need this skill because high-speed autonomy needs enforceable guardrails to stay aligned. This specific skill times execution based on risk posture instead of urgency alone.

## Activation Cues
- Task requires risk-weighted sequencing in Safety and Governance.
- Task needs explicit risk controls, approval gates, and traceable outcomes.
- Task output must include artifact handoff for humans and agents.

## Execution Plan
1. Define the scope and success metrics for `Governance Risk-Aware Scheduler`, including at least three measurable KPIs tied to unsafe actions and policy drift.
2. Design and version the input/output contract for policies, violations, and mitigation actions, then add schema validation and failure-mode handling.
3. Implement the core capability using risk-weighted sequencing, and produce risk-gated schedules with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover unsafe actions and policy drift, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Runbook
Preflight:
- None specified.

Execution:
- None specified.

Recovery:
- None specified.

Handoff:
- None specified.

## Guardrails
- [quality] Require validations before promoting outputs.

## Success Metrics
- Primary metric: unsafe actions
- Secondary metrics: policy drift, decision drift
- Review cadence: weekly

## Output Contract
- Return a concise execution summary with key decisions.
- Return risk and mitigation notes with unresolved blockers.
- Return artifact target: `risk-gated schedules`.
- Return recommended follow-up tasks for next wave execution.
