---
name: openclaw-0758-sequenced-learning-path-design
description: Comms Training Curriculum Composer. Use when work requires sequenced learning path design for Communication and Explainability with guardrails, traceable execution, and measurable outcomes.
---

# Comms Training Curriculum Composer

## Mission
We need this skill because complex systems require explanations humans can act on quickly. This specific skill converts capability gaps into actionable upskilling programs.

## Activation Cues
- Task requires sequenced learning path design in Communication and Explainability.
- Task needs explicit risk controls, approval gates, and traceable outcomes.
- Task output must include artifact handoff for humans and agents.

## Execution Plan
1. Define the scope and success metrics for `Comms Training Curriculum Composer`, including at least three measurable KPIs tied to misinterpretation and trust erosion.
2. Design and version the input/output contract for decision factors, uncertainty markers, and audience summaries, then add schema validation and failure-mode handling.
3. Implement the core capability using sequenced learning path design, and produce role-specific curricula with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover misinterpretation and trust erosion, then run regression baselines.
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
- Primary metric: misinterpretation
- Secondary metrics: trust erosion, decision drift
- Review cadence: weekly

## Output Contract
- Return a concise execution summary with key decisions.
- Return risk and mitigation notes with unresolved blockers.
- Return artifact target: `role-specific curricula`.
- Return recommended follow-up tasks for next wave execution.
