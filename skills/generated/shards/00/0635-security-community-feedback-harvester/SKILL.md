---
name: u0635-security-community-feedback-harvester
description: Operate the "Security Community Feedback Harvester" capability in production for  workflows. Use when mission execution explicitly requires this capability and outcomes must be reproducible, policy-gated, and handoff-ready.
---

# Security Community Feedback Harvester

## Why This Skill Exists
We need this skill because production autonomy must default to least privilege and strong privacy. This specific skill integrates lived user feedback into planning cycles.

## When To Use
Use this skill when the request explicitly needs "Security Community Feedback Harvester" outcomes in the Security and Privacy domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Security Community Feedback Harvester`, including at least three measurable KPIs tied to breach, exfiltration, and over-privileged actions.
2. Design and version the input/output contract for permissions, sensitive data flows, and threat events, then add schema validation and failure-mode handling.
3. Implement the core capability using feedback normalization and clustering, and produce theme-prioritized feedback digests with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover breach, exfiltration, and over-privileged actions, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: feedback normalization and clustering
- Archetype: normalization-engine
- Routing tag: security-and-privacy:normalization-engine

## Input Contract
- `permissions` (signal, source=upstream, required=true)
- `sensitive data flows` (signal, source=upstream, required=true)
- `threat events` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `theme_prioritized_feedback_digests_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `theme_prioritized_feedback_digests_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Security Community Feedback Harvester normalized artifacts; execution scorecard; risk posture
- Consumes: permissions; sensitive data flows; threat events; claims; evidence; confidence traces
- Downstream routing hint: Route next to security-and-privacy:normalization-engine consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
