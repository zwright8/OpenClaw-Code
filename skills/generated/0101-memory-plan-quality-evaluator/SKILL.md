---
name: u0101-memory-plan-quality-evaluator
description: Build and operate the "Memory Plan Quality Evaluator" capability for Memory and Knowledge Operations. Trigger when this exact capability is needed in mission execution.
---

# Memory Plan Quality Evaluator

## Why This Skill Exists
We need this skill because agents lose performance when lessons are not retained and reused. This specific skill quantifies whether plans are complete, safe, and feasible.

## When To Use
Use this skill when the request explicitly needs "Memory Plan Quality Evaluator" outcomes in the Memory and Knowledge Operations domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Memory Plan Quality Evaluator`, including at least three measurable KPIs tied to repeated mistakes and context loss.
2. Design and version the input/output contract for episodic logs, knowledge nodes, and retrieval metadata, then add schema validation and failure-mode handling.
3. Implement the core capability using multi-criteria plan scoring, and produce plan quality scorecards with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover repeated mistakes and context loss, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: multi-criteria plan scoring
- Archetype: general-capability
- Routing tag: memory-and-knowledge-operations:general-capability

## Input Contract
- `episodic logs` (signal, source=upstream, required=true)
- `knowledge nodes` (signal, source=upstream, required=true)
- `retrieval metadata` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `plan_quality_scorecards_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `plan_quality_scorecards_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Memory Plan Quality Evaluator normalized artifacts; execution scorecard; risk posture
- Consumes: episodic logs; knowledge nodes; retrieval metadata; claims; evidence; confidence traces
- Downstream routing hint: Route next to memory-and-knowledge-operations:general-capability consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
