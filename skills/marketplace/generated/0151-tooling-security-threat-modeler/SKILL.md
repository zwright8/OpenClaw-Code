---
name: openclaw-0151-attack-surface-modeling
description: Tooling Security Threat Modeler. Use when work requires attack-surface modeling for Tool Reliability and Execution Quality with guardrails, traceable execution, and measurable outcomes.
---

# Tooling Security Threat Modeler

## Mission
We need this skill because automation collapses when tools are flaky and failure modes are opaque. This specific skill anticipates attack paths before adversaries exploit them.

## Activation Cues
- Task requires attack-surface modeling in Tool Reliability and Execution Quality.
- Task needs explicit risk controls, approval gates, and traceable outcomes.
- Task output must include artifact handoff for humans and agents.

## Execution Plan
1. Define the scope and success metrics for `Tooling Security Threat Modeler`, including at least three measurable KPIs tied to silent failures and cascading retries.
2. Design and version the input/output contract for tool runs, error signatures, and retry outcomes, then add schema validation and failure-mode handling.
3. Implement the core capability using attack-surface modeling, and produce threat models with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover silent failures and cascading retries, then run regression baselines.
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
- Primary metric: silent failures
- Secondary metrics: cascading retries, decision drift
- Review cadence: weekly

## Output Contract
- Return a concise execution summary with key decisions.
- Return risk and mitigation notes with unresolved blockers.
- Return artifact target: `threat models`.
- Return recommended follow-up tasks for next wave execution.
