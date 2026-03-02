---
name: openclaw-0899-entity-and-relation-linking
description: Rights Knowledge Graph Linker. Use when work requires entity and relation linking for Legal, Rights, and Compliance with guardrails, traceable execution, and measurable outcomes.
---

# Rights Knowledge Graph Linker

## Mission
We need this skill because operations must preserve rights and satisfy jurisdictional obligations. This specific skill connects fragmented facts into reusable structures.

## Activation Cues
- Task requires entity and relation linking in Legal, Rights, and Compliance.
- Task needs explicit risk controls, approval gates, and traceable outcomes.
- Task output must include artifact handoff for humans and agents.

## Execution Plan
1. Define the scope and success metrics for `Rights Knowledge Graph Linker`, including at least three measurable KPIs tied to rights violations and compliance penalties.
2. Design and version the input/output contract for requirements mappings, legal decisions, and evidence trails, then add schema validation and failure-mode handling.
3. Implement the core capability using entity and relation linking, and produce linked knowledge entities with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover rights violations and compliance penalties, then run regression baselines.
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
- Primary metric: rights violations
- Secondary metrics: compliance penalties, decision drift
- Review cadence: weekly

## Output Contract
- Return a concise execution summary with key decisions.
- Return risk and mitigation notes with unresolved blockers.
- Return artifact target: `linked knowledge entities`.
- Return recommended follow-up tasks for next wave execution.
