---
name: openclaw-0417-baseline-delta-detection
description: PublicService Regression Sentinel. Use when work requires baseline-delta detection for Healthcare and Public Services with guardrails, traceable execution, and measurable outcomes.
---

# PublicService Regression Sentinel

## Mission
We need this skill because public-facing workflows require strict safety and reliability controls. This specific skill prevents unnoticed quality drift after updates.

## Activation Cues
- Task requires baseline-delta detection in Healthcare and Public Services.
- Task needs explicit risk controls, approval gates, and traceable outcomes.
- Task output must include artifact handoff for humans and agents.

## Execution Plan
1. Define the scope and success metrics for `PublicService Regression Sentinel`, including at least three measurable KPIs tied to service harm and procedural violations.
2. Design and version the input/output contract for protocol checks, service queues, and compliance flags, then add schema validation and failure-mode handling.
3. Implement the core capability using baseline-delta detection, and produce regression watchlists with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover service harm and procedural violations, then run regression baselines.
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
- Primary metric: service harm
- Secondary metrics: procedural violations, decision drift
- Review cadence: weekly

## Output Contract
- Return a concise execution summary with key decisions.
- Return risk and mitigation notes with unresolved blockers.
- Return artifact target: `regression watchlists`.
- Return recommended follow-up tasks for next wave execution.
