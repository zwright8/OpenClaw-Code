---
name: u0968-evolution-dependency-dag-planner
description: Operate the "Evolution Dependency DAG Planner" capability in production for  workflows. Use when mission execution explicitly requires this capability and outcomes must be reproducible, policy-gated, and handoff-ready.
---

# Evolution Dependency DAG Planner

## Why This Skill Exists
We need this skill because agents stagnate without structured reflection and continuous improvement loops. This specific skill prevents sequencing errors and hidden blockers.

## When To Use
Use this skill when the request explicitly needs "Evolution Dependency DAG Planner" outcomes in the Autonomous Learning and Evolution domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Evolution Dependency DAG Planner`, including at least three measurable KPIs tied to capability stagnation and repeated blind spots.
2. Design and version the input/output contract for outcomes, error taxonomies, and adaptation decisions, then add schema validation and failure-mode handling.
3. Implement the core capability using dependency graph compilation, and produce validated workflow DAGs with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover capability stagnation and repeated blind spots, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: dependency graph compilation
- Archetype: planning-router
- Routing tag: autonomous-learning-and-evolution:planning-router

## Input Contract
- `outcomes` (signal, source=upstream, required=true)
- `error taxonomies` (signal, source=upstream, required=true)
- `adaptation decisions` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `validated_workflow_dags_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `validated_workflow_dags_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Evolution Dependency DAG Planner normalized artifacts; execution scorecard; risk posture
- Consumes: outcomes; error taxonomies; adaptation decisions; claims; evidence; confidence traces
- Downstream routing hint: Route next to autonomous-learning-and-evolution:planning-router consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
