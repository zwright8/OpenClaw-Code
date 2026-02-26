---
name: u0190-governance-privacy-preserving-data-broker
description: Build and operate the "Governance Privacy Preserving Data Broker" capability for Safety and Governance. Trigger when this exact capability is needed in mission execution.
---

# Governance Privacy Preserving Data Broker

## Why This Skill Exists
We need this skill because high-speed autonomy needs enforceable guardrails to stay aligned. This specific skill enables collaboration while minimizing raw data exposure.

## When To Use
Use this skill when the request explicitly needs "Governance Privacy Preserving Data Broker" outcomes in the Safety and Governance domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Governance Privacy Preserving Data Broker`, including at least three measurable KPIs tied to unsafe actions and policy drift.
2. Design and version the input/output contract for policies, violations, and mitigation actions, then add schema validation and failure-mode handling.
3. Implement the core capability using policy-scoped data mediation, and produce privacy-scoped exchanges with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover unsafe actions and policy drift, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: policy-scoped data mediation
- Archetype: collaboration-mediator
- Routing tag: safety-and-governance:collaboration-mediator

## Input Contract
- `policies` (signal, source=upstream, required=true)
- `violations` (signal, source=upstream, required=true)
- `mitigation actions` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `privacy_scoped_exchanges_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `privacy_scoped_exchanges_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Governance Privacy Preserving Data Broker normalized artifacts; execution scorecard; risk posture
- Consumes: policies; violations; mitigation actions; claims; evidence; confidence traces
- Downstream routing hint: Route next to safety-and-governance:collaboration-mediator consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
