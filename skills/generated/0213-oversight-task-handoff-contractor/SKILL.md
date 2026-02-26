---
name: u0213-oversight-task-handoff-contractor
description: Build and operate the "Oversight Task Handoff Contractor" capability for Human Oversight and Operator UX. Trigger when this exact capability is needed in mission execution.
---

# Oversight Task Handoff Contractor

## Why This Skill Exists
We need this skill because human teams need fast, legible control when stakes are high. This specific skill standardizes handoffs between agents and humans.

## When To Use
Use this skill when the request explicitly needs "Oversight Task Handoff Contractor" outcomes in the Human Oversight and Operator UX domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Oversight Task Handoff Contractor`, including at least three measurable KPIs tied to slow interventions and approval bottlenecks.
2. Design and version the input/output contract for approval queues, operator workload, and intervention history, then add schema validation and failure-mode handling.
3. Implement the core capability using contracted payload schemas, and produce typed handoff artifacts with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover slow interventions and approval bottlenecks, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: contracted payload schemas
- Archetype: contract-compiler
- Routing tag: human-oversight-and-operator-ux:contract-compiler

## Input Contract
- `approval queues` (signal, source=upstream, required=true)
- `operator workload` (signal, source=upstream, required=true)
- `intervention history` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `typed_handoff_artifacts_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `typed_handoff_artifacts_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Oversight Task Handoff Contractor normalized artifacts; execution scorecard; risk posture
- Consumes: approval queues; operator workload; intervention history; claims; evidence; confidence traces
- Downstream routing hint: Route next to human-oversight-and-operator-ux:contract-compiler consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
