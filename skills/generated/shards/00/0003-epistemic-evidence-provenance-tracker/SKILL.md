---
name: u0003-epistemic-evidence-provenance-tracker
description: Build and operate the "Epistemic Evidence Provenance Tracker" capability for Truth-Seeking and Epistemics. Use when outcomes in this capability family are required for production execution.
---

# Epistemic Evidence Provenance Tracker

## Why This Skill Exists
We need this skill because decisions drift when claims are accepted without verification. This specific skill preserves source lineage so claims remain auditable.

## When To Use
Use this skill when you need "Epistemic Evidence Provenance Tracker" outcomes for the Truth-Seeking and Epistemics domain with measurable, production-facing outputs.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Epistemic Evidence Provenance Tracker`, including at least three measurable KPIs tied to false certainty and unverified assumptions.
2. Design and version the input/output contract for claims, evidence, and confidence traces, then add schema validation and failure-mode handling.
3. Implement the core capability using signed provenance links, and produce evidence lineage graphs with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover false certainty and unverified assumptions, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: signed provenance links
- Archetype: provenance-tracker
- Routing tag: truth-seeking-and-epistemics:provenance-tracker

## Input Contract
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `evidence_lineage_graphs_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `evidence_lineage_graphs_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Epistemic Evidence Provenance Tracker normalized artifacts; execution scorecard; risk posture
- Consumes: claims; evidence; confidence traces
- Downstream routing hint: Route next to truth-seeking-and-epistemics:provenance-tracker consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.

## Immediate Hardening Additions
- Add golden test fixtures for at least 5 representative payloads.
- Add regression test covering the highest-risk failure mode for this capability.
- Emit machine-readable run summary (`status`, `risk_score`, `confidence`, `next_handoff`).
- Fail closed on schema or policy gate violations; never emit publish-level output on gate failure.

## Production Trigger Clarity
- Use only when this capability produces production-facing outcomes with measurable acceptance criteria.
- Do not invoke for exploratory brainstorming or unrelated domains; route those requests to the correct capability family.

## Deterministic Tolerances
- Repeated runs on identical inputs must remain within **<=1% output variance** for scoring fields and preserve schema-identical artifact shape.
- Any variance beyond tolerance is a hard failure and must trigger escalation.

## Fail-Closed Validation Gates
1. Schema validity gate (required inputs present and valid).
2. Determinism gate (variance within tolerance).
3. Policy/approval gate (required approvals satisfied).

If any gate fails: **block output publication and fail closed**.

## High-Risk Human Sign-Off
- Any high-risk change, policy-impacting output, or publish-level action requires explicit human sign-off before release.
- Missing sign-off is a blocking condition.

## Explicit Handoff Contract
- **Produces:** normalized artifacts, decision scorecard, risk/confidence metadata.
- **Consumes:** validated upstream inputs for this capability.
- **Next hop:** route only to declared downstream consumers with gate/approval context attached.
