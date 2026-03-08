---
name: openclaw-0017-baseline-delta-detection
description: Epistemic Regression Sentinel. Use when work requires baseline-delta detection for Truth-Seeking and Epistemics with guardrails, traceable execution, and measurable outcomes.
---

# Epistemic Regression Sentinel

## Mission
We need this skill because decisions drift when claims are accepted without verification. This specific skill prevents unnoticed quality drift after updates.

## Activation Cues
- Task requires baseline-delta detection in Truth-Seeking and Epistemics.
- Task needs explicit risk controls, approval gates, and traceable outcomes.
- Task output must include artifact handoff for humans and agents.

## Execution Plan
1. Define the scope and success metrics for `Epistemic Regression Sentinel`, including at least three measurable KPIs tied to false certainty and unverified assumptions.
2. Design and version the input/output contract for claims, evidence, and confidence traces, then add schema validation and failure-mode handling.
3. Implement the core capability using baseline-delta detection, and produce regression watchlists with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover false certainty and unverified assumptions, then run regression baselines.
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
- Primary metric: false certainty
- Secondary metrics: unverified assumptions, decision drift
- Review cadence: weekly

## Output Contract
- Return a concise execution summary with key decisions.
- Return risk and mitigation notes with unresolved blockers.
- Return artifact target: `regression watchlists`.
- Return recommended follow-up tasks for next wave execution.
