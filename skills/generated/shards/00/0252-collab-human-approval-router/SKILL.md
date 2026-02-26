---
name: u0252-collab-human-approval-router
description: Build and operate the "Collab Human Approval Router" capability for Collaboration and Negotiation. Trigger when this exact capability is needed in mission execution.
---

# Collab Human Approval Router

## Why This Skill Exists
We need this skill because multi-agent systems underperform without explicit conflict resolution. This specific skill directs high-risk decisions to the right humans quickly.

## When To Use
Use this skill when the request explicitly needs "Collab Human Approval Router" outcomes in the Collaboration and Negotiation domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Collab Human Approval Router`, including at least three measurable KPIs tied to deadlocks and degraded trust.
2. Design and version the input/output contract for proposals, contention signals, and negotiated outcomes, then add schema validation and failure-mode handling.
3. Implement the core capability using reviewer routing policies, and produce priority approval queues with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover deadlocks and degraded trust, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: reviewer routing policies
- Archetype: planning-router
- Routing tag: collaboration-and-negotiation:planning-router

## Input Contract
- `proposals` (signal, source=upstream, required=true)
- `contention signals` (signal, source=upstream, required=true)
- `negotiated outcomes` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `priority_approval_queues_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `priority_approval_queues_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Collab Human Approval Router normalized artifacts; execution scorecard; risk posture
- Consumes: proposals; contention signals; negotiated outcomes; claims; evidence; confidence traces
- Downstream routing hint: Route next to collaboration-and-negotiation:planning-router consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
