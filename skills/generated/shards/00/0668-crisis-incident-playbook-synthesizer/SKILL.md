---
name: u0668-crisis-incident-playbook-synthesizer
description: Operate the "Crisis Incident Playbook Synthesizer" capability in production for  workflows. Use when mission execution explicitly requires this capability and outcomes must be reproducible, policy-gated, and handoff-ready.
---

# Crisis Incident Playbook Synthesizer

## Why This Skill Exists
We need this skill because response quality determines whether incidents are contained or amplified. This specific skill creates repeatable response procedures from incident history.

## When To Use
Use this skill when the request explicitly needs "Crisis Incident Playbook Synthesizer" outcomes in the Crisis and Incident Response domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Crisis Incident Playbook Synthesizer`, including at least three measurable KPIs tied to slow containment and repeated outages.
2. Design and version the input/output contract for incident timelines, response roles, and recovery artifacts, then add schema validation and failure-mode handling.
3. Implement the core capability using pattern-to-playbook synthesis, and produce incident playbooks with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover slow containment and repeated outages, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: pattern-to-playbook synthesis
- Archetype: communication-engine
- Routing tag: crisis-and-incident-response:communication-engine

## Input Contract
- `incident timelines` (signal, source=upstream, required=true)
- `response roles` (signal, source=upstream, required=true)
- `recovery artifacts` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `incident_playbooks_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `incident_playbooks_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Crisis Incident Playbook Synthesizer normalized artifacts; execution scorecard; risk posture
- Consumes: incident timelines; response roles; recovery artifacts; claims; evidence; confidence traces
- Downstream routing hint: Route next to crisis-and-incident-response:communication-engine consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
