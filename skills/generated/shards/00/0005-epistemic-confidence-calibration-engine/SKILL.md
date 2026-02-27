---
name: u0005-epistemic-confidence-calibration-engine
description: Build and operate the "Epistemic Confidence Calibration Engine" capability for Truth-Seeking and Epistemics. Use when outcomes in this capability family are required for production execution.
---

# Epistemic Confidence Calibration Engine

## Why This Skill Exists
We need this skill because decisions drift when claims are accepted without verification. This specific skill aligns reported confidence with actual uncertainty.

## When To Use
Use this skill when you need "Epistemic Confidence Calibration Engine" outcomes for the Truth-Seeking and Epistemics domain with measurable, production-facing outputs.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Epistemic Confidence Calibration Engine`, including at least three measurable KPIs tied to false certainty and unverified assumptions.
2. Design and version the input/output contract for claims, evidence, and confidence traces, then add schema validation and failure-mode handling.
3. Implement the core capability using calibration curves and error bins, and produce calibrated confidence scores with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover false certainty and unverified assumptions, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: calibration curves and error bins
- Archetype: optimization-engine
- Routing tag: truth-seeking-and-epistemics:optimization-engine

## Input Contract
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `calibrated_confidence_scores_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `calibrated_confidence_scores_scorecard` (scorecard, consumer=operator, guaranteed=true)

## Validation Gates
1. **schema-contract-check** — All required input signals present and schema-valid (on fail: quarantine)
2. **determinism-check** — Repeated run on same inputs yields stable scoring and artifacts within tolerance <= 1% (on fail: escalate)
3. **policy-approval-check** — Approval gates satisfied before publish-level outputs; high-risk changes require human sign-off (on fail: block)

## Failure Handling
- `E_INPUT_SCHEMA`: Missing or malformed required signals → Reject payload, emit validation error, request corrected payload
- `E_NON_DETERMINISM`: Determinism delta exceeds allowed threshold → Freeze output, escalate to human approval router
- `E_DEPENDENCY_TIMEOUT`: Downstream or external dependency timeout → Apply retry policy then rollback to last stable baseline
- Rollback strategy: rollback-to-last-stable-baseline

## Handoff Contract
- Produces: Epistemic Confidence Calibration Engine normalized artifacts; execution scorecard; risk posture
- Consumes: claims; evidence; confidence traces
- Downstream routing hint: Route next to truth-seeking-and-epistemics:optimization-engine consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.

## Immediate Hardening Additions
- Add golden test fixtures for at least 5 representative payloads.
- Add regression test covering the highest-risk failure mode for this capability.
- Emit machine-readable run summary (`status`, `risk_score`, `confidence`, `next_handoff`).
- Fail closed on schema or policy gate violations; never emit publish-level output on gate failure.
