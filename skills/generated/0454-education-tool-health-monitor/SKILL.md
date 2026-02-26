---
name: u0454-education-tool-health-monitor
description: Build and operate the "Education Tool Health Monitor" capability for Education and Upskilling. Trigger when this exact capability is needed in mission execution.
---

# Education Tool Health Monitor

## Why This Skill Exists
We need this skill because human capability growth requires targeted planning under constraints. This specific skill detects tool flakiness before it impacts mission outcomes.

## When To Use
Use this skill when the request explicitly needs "Education Tool Health Monitor" outcomes in the Education and Upskilling domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Education Tool Health Monitor`, including at least three measurable KPIs tied to persistent skill gaps and poor learning outcomes.
2. Design and version the input/output contract for skill profiles, learning paths, and support resources, then add schema validation and failure-mode handling.
3. Implement the core capability using telemetry aggregation and SLO checks, and produce tool reliability scores with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover persistent skill gaps and poor learning outcomes, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: telemetry aggregation and SLO checks
- Archetype: detection-guard
- Routing tag: education-and-upskilling:detection-guard

## Input Contract
- `skill profiles` (signal, source=upstream, required=true)
- `learning paths` (signal, source=upstream, required=true)
- `support resources` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `tool_reliability_scores_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `tool_reliability_scores_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Education Tool Health Monitor normalized artifacts; execution scorecard; risk posture
- Consumes: skill profiles; learning paths; support resources; claims; evidence; confidence traces
- Downstream routing hint: Route next to education-and-upskilling:detection-guard consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
