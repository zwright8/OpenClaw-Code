---
name: u0544-engineering-explainability-narrative-builder
description: Operate the "Engineering Explainability Narrative Builder" capability in production for  workflows. Use when mission execution explicitly requires this capability and outcomes must be reproducible, policy-gated, and handoff-ready.
---

# Engineering Explainability Narrative Builder

## Why This Skill Exists
We need this skill because delivery speed must increase without sacrificing correctness. This specific skill translates technical decisions into operator-usable narratives.

## When To Use
Use this skill when you need "Engineering Explainability Narrative Builder" outcomes for the Software Engineering Automation domain with measurable, production-facing outputs.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Engineering Explainability Narrative Builder`, including at least three measurable KPIs tied to regressions and brittle release pipelines.
2. Design and version the input/output contract for code changes, tests, incidents, and rollout data, then add schema validation and failure-mode handling.
3. Implement the core capability using reason synthesis and abstraction, and produce decision narratives with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover regressions and brittle release pipelines, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: reason synthesis and abstraction
- Archetype: communication-engine
- Routing tag: software-engineering-automation:communication-engine

## Input Contract
- `code changes` (signal, source=upstream, required=true)
- `tests` (signal, source=upstream, required=true)
- `incidents` (signal, source=upstream, required=true)
- `rollout data` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `decision_narratives_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `decision_narratives_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Engineering Explainability Narrative Builder normalized artifacts; execution scorecard; risk posture
- Consumes: code changes; tests; incidents; rollout data; claims; evidence; confidence traces
- Downstream routing hint: Route next to software-engineering-automation:communication-engine consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.

## Immediate Hardening Additions
- Add golden test fixtures for at least 5 representative payloads.
- Add regression test covering the highest-risk failure mode for this capability.
- Emit machine-readable run summary (`status`, `risk_score`, `confidence`, `next_handoff`).
- Fail closed on schema or policy gate violations; never emit publish-level output on gate failure.
