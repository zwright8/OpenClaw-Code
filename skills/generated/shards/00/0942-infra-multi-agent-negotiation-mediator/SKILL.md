---
name: u0942-infra-multi-agent-negotiation-mediator
description: Operate the "Infra Multi-Agent Negotiation Mediator" capability in production for  workflows. Use when mission execution explicitly requires this capability and outcomes must be reproducible, policy-gated, and handoff-ready.
---

# Infra Multi-Agent Negotiation Mediator

## Why This Skill Exists
We need this skill because long-term scale depends on resilient and sustainable infrastructure choices. This specific skill resolves resource and strategy conflicts with explicit tradeoffs.

## When To Use
Use this skill when the request explicitly needs "Infra Multi-Agent Negotiation Mediator" outcomes in the Infrastructure and Sustainability domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Infra Multi-Agent Negotiation Mediator`, including at least three measurable KPIs tied to capacity collapse and environmental debt.
2. Design and version the input/output contract for capacity forecasts, energy usage, and sustainability metrics, then add schema validation and failure-mode handling.
3. Implement the core capability using structured bargaining protocols, and produce negotiated agreement sets with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover capacity collapse and environmental debt, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: structured bargaining protocols
- Archetype: collaboration-mediator
- Routing tag: infrastructure-and-sustainability:collaboration-mediator

## Input Contract
- `capacity forecasts` (signal, source=upstream, required=true)
- `energy usage` (signal, source=upstream, required=true)
- `sustainability metrics` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `negotiated_agreement_sets_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `negotiated_agreement_sets_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Infra Multi-Agent Negotiation Mediator normalized artifacts; execution scorecard; risk posture
- Consumes: capacity forecasts; energy usage; sustainability metrics; claims; evidence; confidence traces
- Downstream routing hint: Route next to infrastructure-and-sustainability:collaboration-mediator consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
