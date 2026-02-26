---
name: u0705-impact-uncertainty-communicator
description: Build and operate the "Impact Uncertainty Communicator" capability for Social Impact Measurement. Trigger when this exact capability is needed in mission execution.
---

# Impact Uncertainty Communicator

## Why This Skill Exists
We need this skill because missions need measurable outcomes, not just activity volume. This specific skill prevents overstatement by explicitly framing uncertainty.

## When To Use
Use this skill when the request explicitly needs "Impact Uncertainty Communicator" outcomes in the Social Impact Measurement domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Impact Uncertainty Communicator`, including at least three measurable KPIs tied to impact theater and unmeasured harm.
2. Design and version the input/output contract for community outcomes, KPI trends, and intervention deltas, then add schema validation and failure-mode handling.
3. Implement the core capability using confidence-bound communication templates, and produce uncertainty briefs with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover impact theater and unmeasured harm, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: confidence-bound communication templates
- Archetype: communication-engine
- Routing tag: social-impact-measurement:communication-engine

## Input Contract
- `community outcomes` (signal, source=upstream, required=true)
- `kpi trends` (signal, source=upstream, required=true)
- `intervention deltas` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `uncertainty_briefs_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `uncertainty_briefs_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Impact Uncertainty Communicator normalized artifacts; execution scorecard; risk posture
- Consumes: community outcomes; kpi trends; intervention deltas; claims; evidence; confidence traces
- Downstream routing hint: Route next to social-impact-measurement:communication-engine consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
