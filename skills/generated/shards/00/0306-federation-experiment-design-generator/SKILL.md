---
name: u0306-federation-experiment-design-generator
description: Build and operate the "Federation Experiment Design Generator" capability for Federation and Interoperability. Trigger when this exact capability is needed in mission execution.
---

# Federation Experiment Design Generator

## Why This Skill Exists
We need this skill because cross-org collaboration fails without shared contracts and trust primitives. This specific skill converts unknowns into testable learning loops.

## When To Use
Use this skill when the request explicitly needs "Federation Experiment Design Generator" outcomes in the Federation and Interoperability domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Federation Experiment Design Generator`, including at least three measurable KPIs tied to integration breakage and trust boundary violations.
2. Design and version the input/output contract for envelopes, tenant boundaries, and protocol bridges, then add schema validation and failure-mode handling.
3. Implement the core capability using hypothesis-driven design, and produce experiment plans with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover integration breakage and trust boundary violations, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: hypothesis-driven design
- Archetype: general-capability
- Routing tag: federation-and-interoperability:general-capability

## Input Contract
- `envelopes` (signal, source=upstream, required=true)
- `tenant boundaries` (signal, source=upstream, required=true)
- `protocol bridges` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `experiment_plans_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `experiment_plans_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Federation Experiment Design Generator normalized artifacts; execution scorecard; risk posture
- Consumes: envelopes; tenant boundaries; protocol bridges; claims; evidence; confidence traces
- Downstream routing hint: Route next to federation-and-interoperability:general-capability consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
