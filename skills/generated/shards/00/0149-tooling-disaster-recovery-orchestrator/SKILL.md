---
name: u0149-tooling-disaster-recovery-orchestrator
description: Build and operate the "Tooling Disaster Recovery Orchestrator" capability for Tool Reliability and Execution Quality. Trigger when this exact capability is needed in mission execution.
---

# Tooling Disaster Recovery Orchestrator

## Why This Skill Exists
We need this skill because automation collapses when tools are flaky and failure modes are opaque. This specific skill improves recovery speed after severe outages.

## When To Use
Use this skill when the request explicitly needs "Tooling Disaster Recovery Orchestrator" outcomes in the Tool Reliability and Execution Quality domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Tooling Disaster Recovery Orchestrator`, including at least three measurable KPIs tied to silent failures and cascading retries.
2. Design and version the input/output contract for tool runs, error signatures, and retry outcomes, then add schema validation and failure-mode handling.
3. Implement the core capability using failover and restoration sequencing, and produce recovery mission plans with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover silent failures and cascading retries, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: failover and restoration sequencing
- Archetype: general-capability
- Routing tag: tool-reliability-and-execution-quality:general-capability

## Input Contract
- `tool runs` (signal, source=upstream, required=true)
- `error signatures` (signal, source=upstream, required=true)
- `retry outcomes` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `recovery_mission_plans_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `recovery_mission_plans_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Tooling Disaster Recovery Orchestrator normalized artifacts; execution scorecard; risk posture
- Consumes: tool runs; error signatures; retry outcomes; claims; evidence; confidence traces
- Downstream routing hint: Route next to tool-reliability-and-execution-quality:general-capability consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
