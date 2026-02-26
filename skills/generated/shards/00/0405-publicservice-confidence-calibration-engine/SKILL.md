---
name: u0405-publicservice-confidence-calibration-engine
description: Build and operate the "PublicService Confidence Calibration Engine" capability for Healthcare and Public Services. Trigger when this exact capability is needed in mission execution.
---

# PublicService Confidence Calibration Engine

## Why This Skill Exists
We need this skill because public-facing workflows require strict safety and reliability controls. This specific skill aligns reported confidence with actual uncertainty.

## When To Use
Use this skill when the request explicitly needs "PublicService Confidence Calibration Engine" outcomes in the Healthcare and Public Services domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `PublicService Confidence Calibration Engine`, including at least three measurable KPIs tied to service harm and procedural violations.
2. Design and version the input/output contract for protocol checks, service queues, and compliance flags, then add schema validation and failure-mode handling.
3. Implement the core capability using calibration curves and error bins, and produce calibrated confidence scores with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover service harm and procedural violations, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: calibration curves and error bins
- Archetype: optimization-engine
- Routing tag: healthcare-and-public-services:optimization-engine

## Input Contract
- `protocol checks` (signal, source=upstream, required=true)
- `service queues` (signal, source=upstream, required=true)
- `compliance flags` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `calibrated_confidence_scores_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `calibrated_confidence_scores_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: PublicService Confidence Calibration Engine normalized artifacts; execution scorecard; risk posture
- Consumes: protocol checks; service queues; compliance flags; claims; evidence; confidence traces
- Downstream routing hint: Route next to healthcare-and-public-services:optimization-engine consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
