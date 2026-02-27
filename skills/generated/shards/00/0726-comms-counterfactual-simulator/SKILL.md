---
name: u0726-comms-counterfactual-simulator
description: Operate the "Comms Counterfactual Simulator" capability in production for  workflows. Use when mission execution explicitly requires this capability and outcomes must be reproducible, policy-gated, and handoff-ready.
---

# Comms Counterfactual Simulator

## Why This Skill Exists
We need this skill because complex systems require explanations humans can act on quickly. This specific skill tests alternatives before costly commitments.

## When To Use
Use this skill when the request explicitly needs "Comms Counterfactual Simulator" outcomes in the Communication and Explainability domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Comms Counterfactual Simulator`, including at least three measurable KPIs tied to misinterpretation and trust erosion.
2. Design and version the input/output contract for decision factors, uncertainty markers, and audience summaries, then add schema validation and failure-mode handling.
3. Implement the core capability using counterfactual replay, and produce scenario comparison reports with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover misinterpretation and trust erosion, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: counterfactual replay
- Archetype: simulation-lab
- Routing tag: communication-and-explainability:simulation-lab

## Input Contract
- `decision factors` (signal, source=upstream, required=true)
- `uncertainty markers` (signal, source=upstream, required=true)
- `audience summaries` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `scenario_comparison_reports_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `scenario_comparison_reports_scorecard` (scorecard, consumer=operator, guaranteed=true)

## Validation Gates
1. **schema-contract-check** — All required input signals present and schema-valid (on fail: quarantine)
2. **determinism-check** — Repeated run on same inputs yields stable scoring and artifacts (on fail: escalate)
3. **policy-approval-check** — Approval gates satisfied before publish-level outputs (on fail: retry)

## Failure Handling
- `E_INPUT_SCHEMA`: Missing or malformed required signals → Reject payload, emit validation error, request corrected payload
- `E_NON_DETERMINISM`: Determinism delta exceeds allowed threshold → Freeze output, escalate to human approval router
- `E_DEPENDENCY_TIMEOUT`: Downstream or external dependency timeout → Apply retry policy then rollback to last stable baseline
- Rollback strategy: rollback-to-last-stable-baseline

## Handoff Contract
- Produces: Comms Counterfactual Simulator normalized artifacts; execution scorecard; risk posture
- Consumes: decision factors; uncertainty markers; audience summaries; claims; evidence; confidence traces
- Downstream routing hint: Route next to communication-and-explainability:simulation-lab consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
