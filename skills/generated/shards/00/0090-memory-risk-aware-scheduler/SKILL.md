---
name: u0090-memory-risk-aware-scheduler
description: Build and operate the "Memory Risk-Aware Scheduler" capability for Memory and Knowledge Operations. Use when outcomes in this capability family are required for production execution.
---

# Memory Risk-Aware Scheduler

## Why This Skill Exists
This skill exists to make memory and knowledge operations execution reliable under real production pressure, with explicit contracts, measurable outcomes, and fail-closed governance.

## When To Use
Use this skill when you need "Memory Risk-Aware Scheduler" outputs that will influence production decisions, automated routing, policy posture, or external-facing actions.

## Step-by-Step Implementation Guide
1. Define scope, operational risk tier, and at least three KPIs tied to correctness, latency, and incident prevention.
2. Specify versioned input/output contracts and enforce strict schema validation before any processing.
3. Implement the core capability using risk-weighted sequencing, with deterministic scoring and reproducible artifact generation.
4. Integrate orchestration controls: retry/backoff, idempotency keys, rollback checkpoints, and audit logging.
5. Add tests (unit, integration, regression, and adversarial) that cover malformed signals, drift, and boundary thresholds.
6. Deploy behind a feature flag, run staged rollout checks, and tune thresholds only through controlled change approval.

## Deterministic Workflow Notes
- Core method: risk-weighted sequencing
- Execution mode: deterministic-first with explicit tolerances
- Routing tag: memory-and-knowledge-operations:memory-risk-aware-scheduler

## Input Contract
- `primary_signals` (array<object>, required=true)
- `policy_context` (object, required=true)
- `provenance_bundle` (object, required=true)
- `confidence_trace` (object, required=true)

## Output Contract
- `memory_risk_aware_scheduler_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `memory_risk_aware_scheduler_scorecard` (scorecard, consumer=operator, guaranteed=true)
- `memory_risk_aware_scheduler_handoff` (handoff-packet, consumer=downstream-skill, guaranteed=true)

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


## Trigger Checklist
- [ ] The request explicitly needs **Memory Risk-Aware Scheduler** outcomes (not generic brainstorming).
- [ ] Inputs are sufficient to execute in **Memory and Knowledge Operations** with measurable acceptance criteria.
- [ ] A downstream consumer is identified for the output artifacts (operator/orchestrator/audit log).
- [ ] If any item is false, route to discovery/scoping first instead of invoking this skill.

## Operational Cadence (Day / Week / Month)
- **Daily:** Run when new memory and knowledge operations signals arrive or when active decisions depend on this capability.
- **Weekly:** Review thresholds, drift, and failure telemetry; calibrate decision rules and retry policy.
- **Monthly:** Re-baseline deterministic expectations, archive evidence, and refresh approval/handoff assumptions.

## Practical Usage Examples
1. **Incident stabilization in Memory and Knowledge Operations**
   - Input: noisy upstream payload requiring memory risk-aware scheduler normalization/assessment.
   - Expected output: schema-valid artifact bundle + scorecard + explicit next-hop routing hint.
   - Handoff: orchestrator receives deterministic result package for gated downstream execution.
2. **Planned delivery quality check**
   - Input: scheduled batch with known baseline and acceptance metrics.
   - Expected output: pass/fail gate results, variance notes, and publish/no-publish recommendation.
   - Handoff: operator receives execution summary with risk/confidence and approval requirements.

## Anti-Patterns (Do Not Use)
- Do **not** use for open-ended ideation where success metrics and contracts are undefined.
- Do **not** bypass schema/policy gates to force output publication under time pressure.
- Do **not** treat non-deterministic or partial outputs as release-ready artifacts.
- Do **not** invoke this skill when a different capability family is the true bottleneck.
