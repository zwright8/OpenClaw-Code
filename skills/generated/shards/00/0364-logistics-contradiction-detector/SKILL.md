---
name: u0364-logistics-contradiction-detector
description: Build and operate the "Logistics Contradiction Detector" capability for Resource Allocation and Logistics. Use when outcomes in this capability family are required for production execution.
---

# Logistics Contradiction Detector

## Why This Skill Exists
This skill exists to make resource allocation and logistics execution reliable under real production pressure, with explicit contracts, measurable outcomes, and fail-closed governance.

## When To Use
Use this skill when you need "Logistics Contradiction Detector" outputs that will influence production decisions, automated routing, policy posture, or external-facing actions.

## Step-by-Step Implementation Guide
1. Define scope, operational risk tier, and at least three KPIs tied to correctness, latency, and incident prevention.
2. Specify versioned input/output contracts and enforce strict schema validation before any processing.
3. Implement the core capability using signal-differential analysis, with deterministic scoring and reproducible artifact generation.
4. Integrate orchestration controls: retry/backoff, idempotency keys, rollback checkpoints, and audit logging.
5. Add tests (unit, integration, regression, and adversarial) that cover malformed signals, drift, and boundary thresholds.
6. Deploy behind a feature flag, run staged rollout checks, and tune thresholds only through controlled change approval.

## Deterministic Workflow Notes
- Core method: signal-differential analysis
- Execution mode: deterministic-first with explicit tolerances
- Routing tag: resource-allocation-and-logistics:logistics-contradiction-detector

## Input Contract
- `primary_signals` (array<object>, required=true)
- `policy_context` (object, required=true)
- `provenance_bundle` (object, required=true)
- `confidence_trace` (object, required=true)

## Output Contract
- `logistics_contradiction_detector_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `logistics_contradiction_detector_scorecard` (scorecard, consumer=operator, guaranteed=true)
- `logistics_contradiction_detector_handoff` (handoff-packet, consumer=downstream-skill, guaranteed=true)

## Validation Gates
1. **schema-contract-check** — Reject if any required input is missing or malformed (on fail: quarantine)
2. **determinism-check** — Re-run on identical inputs; output deltas must remain within tolerance <= 1% (on fail: escalate)
3. **policy-gate-check** — Block publish-level artifacts until all policy checks pass (on fail: block)
4. **high-risk-approval-check** — Require explicit human sign-off for high-risk impact changes (on fail: hold)

## Failure Handling
- `E_INPUT_SCHEMA`: Invalid or missing required signals → Reject request; emit structured validation errors
- `E_POLICY_BLOCK`: Policy guard violation → Fail closed; do not emit publish-level outputs
- `E_NON_DETERMINISM`: Reproducibility delta exceeds tolerance → Freeze artifacts; route to human approval
- `E_DEPENDENCY_FAILURE`: Upstream/downstream dependency unavailable → Execute bounded retries then rollback
- Rollback strategy: rollback-to-last-stable-baseline with incident annotation

## Handoff Contract
- Produces: validated artifacts, confidence trace, risk posture, machine-readable handoff packet
- Consumes: production-scoped signals, policy context, provenance evidence, deterministic config
- Downstream routing hint: pass only gate-cleared artifacts with approval state and rollback pointer

## Required Deliverables
- Versioned capability contract with deterministic tolerances and explicit failure semantics.
- Test evidence covering nominal, edge, adversarial, and rollback scenarios.
- Rollout evidence (feature-flag stage logs, gate outcomes, and operator sign-off where required).

## Immediate Hardening Additions
- Add at least 5 golden fixtures with expected outputs and tolerance assertions.
- Add regression tests for the highest-severity failure mode and policy bypass attempts.
- Emit machine-readable run summary: `status`, `risk_score`, `confidence`, `approval_state`, `next_handoff`.
- Enforce fail-closed behavior on schema, determinism, and policy gate failures.

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

