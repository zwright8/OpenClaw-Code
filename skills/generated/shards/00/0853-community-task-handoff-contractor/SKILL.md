---
name: u0853-community-task-handoff-contractor
description: Build and operate the "Community Task Handoff Contractor" capability for Community Engagement and Feedback. Use when outcomes in this capability family are required for production execution.
---

# Community Task Handoff Contractor

## Why This Skill Exists
We need this skill because real-world feedback loops are necessary for continuous alignment. This specific skill standardizes handoffs between agents and humans.

## When To Use
Use this skill when you need "Community Task Handoff Contractor" outcomes for the Community Engagement and Feedback domain with measurable, production-facing outputs.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Community Task Handoff Contractor`, including at least three measurable KPIs tied to community trust loss and unaddressed concerns.
2. Design and version the input/output contract for feedback channels, sentiment, urgency, and follow-ups, then add schema validation and failure-mode handling.
3. Implement the core capability using contracted payload schemas, and produce typed handoff artifacts with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover community trust loss and unaddressed concerns, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: contracted payload schemas
- Archetype: contract-compiler
- Routing tag: community-engagement-and-feedback:contract-compiler

## Input Contract
- `feedback channels` (signal, source=upstream, required=true)
- `sentiment` (signal, source=upstream, required=true)
- `urgency` (signal, source=upstream, required=true)
- `follow-ups` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `typed_handoff_artifacts_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `typed_handoff_artifacts_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Community Task Handoff Contractor normalized artifacts; execution scorecard; risk posture
- Consumes: feedback channels; sentiment; urgency; follow-ups; claims; evidence; confidence traces
- Downstream routing hint: Route next to community-engagement-and-feedback:contract-compiler consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.

## Immediate Hardening Additions
- Add golden test fixtures for at least 5 representative payloads.
- Add regression test covering the highest-risk failure mode for this capability.
- Emit machine-readable run summary (`status`, `risk_score`, `confidence`, `next_handoff`).
- Fail closed on schema or policy gate violations; never emit publish-level output on gate failure.
