---
name: u0113-memory-cost-benefit-forecaster
description: Build and operate the "Memory Cost-Benefit Forecaster" capability for Memory and Knowledge Operations. Trigger when this exact capability is needed in mission execution.
---

# Memory Cost-Benefit Forecaster

## Why This Skill Exists
We need this skill because agents lose performance when lessons are not retained and reused. This specific skill prioritizes actions with the strongest net value.

## When To Use
Use this skill only when all of the following production criteria are true:
- The task explicitly requires `u0113-memory-cost-benefit-forecaster` outcomes in the declared domain and cannot be handled by a simpler upstream capability.
- Required upstream artifacts are available, schema-valid, and freshness-checked within the active execution window.
- A named downstream consumer is declared for the primary report and scorecard outputs.
- For high-risk impact (policy, safety, legal, security, privacy, or external publication), a human approver is assigned before execution starts.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Memory Cost-Benefit Forecaster`, including at least three measurable KPIs tied to repeated mistakes and context loss.
2. Design and version the input/output contract for episodic logs, knowledge nodes, and retrieval metadata, then add schema validation and failure-mode handling.
3. Implement the core capability using cost-impact simulation, and produce forecasted ROI scenarios with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover repeated mistakes and context loss, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: cost-impact simulation
- Archetype: simulation-lab
- Routing tag: memory-and-knowledge-operations:simulation-lab
- Determinism tolerance: max score delta <= 0.5% and max rank drift <= 1 position on identical inputs across reruns.
- Execution tolerance: p95 end-to-end latency variance <= 10% across three replay runs.
- Non-determinism policy: exceedance triggers fail-closed behavior and blocks publish-level output until human sign-off.

## Input Contract
- `episodic logs` (signal, source=upstream, required=true)
- `knowledge nodes` (signal, source=upstream, required=true)
- `retrieval metadata` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `forecasted_roi_scenarios_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `forecasted_roi_scenarios_scorecard` (scorecard, consumer=operator, guaranteed=true)

## Validation Gates
1. **schema-contract-check** — All required input signals present, schema-valid, and freshness-valid (on fail: fail-closed, reject run).
2. **determinism-check** — Replay on identical inputs stays within explicit tolerance bounds (on fail: fail-closed, open incident).
3. **policy-approval-check** — Policy/compliance/data-handling constraints pass with no waivers (on fail: fail-closed, quarantine artifacts).
4. **high-risk-human-signoff** — Required for high-risk runs before publish-level release (on fail: hold output, no externalization).

## Failure Handling
- `E_INPUT_SCHEMA`: Missing or malformed required signals → Reject payload, emit validation error, request corrected payload
- `E_NON_DETERMINISM`: Determinism delta exceeds allowed threshold → Freeze output, escalate to human approval router
- `E_DEPENDENCY_TIMEOUT`: Downstream or external dependency timeout → Apply retry policy then rollback to last stable baseline
- Rollback strategy: rollback-to-last-stable-baseline

## Handoff Contract
- Produces: normalized capability artifacts, execution scorecard, risk posture, and machine-readable run summary.
- Consumes: declared upstream signals plus validated policy and approval context.
- Preconditions to handoff: all validation gates pass; high-risk runs include human sign-off (approver ID + timestamp).
- Downstream routing hint: route only to declared consumers for this run; otherwise halt and request routing confirmation.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.


## Immediate Hardening Additions
- Add and keep current at least 5 golden fixtures in `fixtures/` with deterministic expected outputs.
- Add and run a regression case for the highest-risk failure mode at `tests/regression-case.md`.
- Emit `hardening-summary.json` per run with `status`, `risk_score`, `confidence`, `tolerance_result`, and `next_handoff`.
- Fail closed on schema/policy/sign-off failures; never emit publish-level outputs on gate failure.
