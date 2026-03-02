---
name: openclaw-0196-metric-synthesis-and-publication
description: Governance KPI Dashboard Publisher. Use when work requires metric synthesis and publication for Safety and Governance with guardrails, traceable execution, and measurable outcomes.
---

# Governance KPI Dashboard Publisher

## Mission
We need this skill because high-speed autonomy needs enforceable guardrails to stay aligned. This specific skill keeps mission status observable in real time.

## Activation Cues
- Task requires metric synthesis and publication in Safety and Governance.
- Task needs explicit risk controls, approval gates, and traceable outcomes.
- Task output must include artifact handoff for humans and agents.

## Execution Plan
1. Define the scope and success metrics for `Governance KPI Dashboard Publisher`, including at least three measurable KPIs tied to unsafe actions and policy drift.
2. Design and version the input/output contract for policies, violations, and mitigation actions, then add schema validation and failure-mode handling.
3. Implement the core capability using metric synthesis and publication, and produce operator KPI dashboards with deterministic scoring.
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
- Return artifact target: `operator KPI dashboards`.
- Return recommended follow-up tasks for next wave execution.
