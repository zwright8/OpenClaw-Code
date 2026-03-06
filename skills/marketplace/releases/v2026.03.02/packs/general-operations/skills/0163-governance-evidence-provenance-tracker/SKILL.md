---
name: openclaw-0163-signed-provenance-links
description: Governance Evidence Provenance Tracker. Use when work requires signed provenance links for Safety and Governance with guardrails, traceable execution, and measurable outcomes.
---

# Governance Evidence Provenance Tracker

## Mission
We need this skill because high-speed autonomy needs enforceable guardrails to stay aligned. This specific skill preserves source lineage so claims remain auditable.

## Activation Cues
- Task requires signed provenance links in Safety and Governance.
- Task needs explicit risk controls, approval gates, and traceable outcomes.
- Task output must include artifact handoff for humans and agents.

## Execution Plan
1. Define the scope and success metrics for `Governance Evidence Provenance Tracker`, including at least three measurable KPIs tied to unsafe actions and policy drift.
2. Design and version the input/output contract for policies, violations, and mitigation actions, then add schema validation and failure-mode handling.
3. Implement the core capability using signed provenance links, and produce evidence lineage graphs with deterministic scoring.
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
- Return artifact target: `evidence lineage graphs`.
- Return recommended follow-up tasks for next wave execution.
