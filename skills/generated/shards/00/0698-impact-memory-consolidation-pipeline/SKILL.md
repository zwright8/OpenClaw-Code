---
name: u0698-impact-memory-consolidation-pipeline
description: Operate the "Impact Memory Consolidation Pipeline" capability in production for  workflows. Use when mission execution explicitly requires this capability and outcomes must be reproducible, policy-gated, and handoff-ready.
---

# Impact Memory Consolidation Pipeline

## Why This Skill Exists
We need this skill because missions need measurable outcomes, not just activity volume. This specific skill turns raw logs into durable reusable memory.

## When To Use
Use this skill when the request explicitly needs "Impact Memory Consolidation Pipeline" outcomes in the Social Impact Measurement domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Impact Memory Consolidation Pipeline`, including at least three measurable KPIs tied to impact theater and unmeasured harm.
2. Design and version the input/output contract for community outcomes, KPI trends, and intervention deltas, then add schema validation and failure-mode handling.
3. Implement the core capability using episodic-to-semantic consolidation, and produce consolidated memory snapshots with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover impact theater and unmeasured harm, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: episodic-to-semantic consolidation
- Archetype: general-capability
- Routing tag: social-impact-measurement:general-capability

## Input Contract
- `community outcomes` (signal, source=upstream, required=true)
- `kpi trends` (signal, source=upstream, required=true)
- `intervention deltas` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `consolidated_memory_snapshots_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `consolidated_memory_snapshots_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Impact Memory Consolidation Pipeline normalized artifacts; execution scorecard; risk posture
- Consumes: community outcomes; kpi trends; intervention deltas; claims; evidence; confidence traces
- Downstream routing hint: Route next to social-impact-measurement:general-capability consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
