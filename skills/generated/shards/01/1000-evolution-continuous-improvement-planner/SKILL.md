---
name: u1000-evolution-continuous-improvement-planner
description: Operate the "Evolution Continuous Improvement Planner" capability in production for  workflows. Use when mission execution explicitly requires this capability and outcomes must be reproducible, policy-gated, and handoff-ready.
---

# Evolution Continuous Improvement Planner

## Why This Skill Exists
This skill exists to make autonomous learning and evolution execution reliable under real production pressure, with explicit contracts, measurable outcomes, and fail-closed governance.

## When To Use
Use this skill when you need "Evolution Continuous Improvement Planner" outputs that will influence production decisions, automated routing, policy posture, or external-facing actions.

## Step-by-Step Implementation Guide
1. Define scope, operational risk tier, and at least three KPIs tied to correctness, latency, and incident prevention.
2. Specify versioned input/output contracts and enforce strict schema validation before any processing.
3. Implement the core capability using deterministic contract execution, with deterministic scoring and reproducible artifact generation.
4. Integrate orchestration controls: retry/backoff, idempotency keys, rollback checkpoints, and audit logging.
5. Add tests (unit, integration, regression, and adversarial) that cover malformed signals, drift, and boundary thresholds.
6. Deploy behind a feature flag, run staged rollout checks, and tune thresholds only through controlled change approval.

## Deterministic Workflow Notes
- Core method: deterministic contract execution
- Execution mode: deterministic-first with explicit tolerances
- Routing tag: autonomous-learning-and-evolution:evolution-continuous-improvement-planner

## Input Contract
- `primary_signals` (array<object>, required=true)
- `policy_context` (object, required=true)
- `provenance_bundle` (object, required=true)
- `confidence_trace` (object, required=true)

## Output Contract
- `evolution_continuous_improvement_planner_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `evolution_continuous_improvement_planner_scorecard` (scorecard, consumer=operator, guaranteed=true)
- `evolution_continuous_improvement_planner_handoff` (handoff-packet, consumer=downstream-skill, guaranteed=true)

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

## Trigger Checklist
- [ ] The request explicitly needs **Evolution Continuous Improvement Planner** outcomes (not generic brainstorming).
- [ ] Inputs are sufficient to execute in **workflows** with measurable acceptance criteria.
- [ ] A downstream consumer is identified for the output artifacts (operator/orchestrator/audit log).
- [ ] If any item is false, route to discovery/scoping first instead of invoking this skill.

## Operational Cadence (Day / Week / Month)
- **Daily:** Run when new workflows signals arrive or when active decisions depend on this capability.
- **Weekly:** Review thresholds, drift, and failure telemetry; calibrate decision rules and retry policy.
- **Monthly:** Re-baseline deterministic expectations, archive evidence, and refresh approval/handoff assumptions.

## Practical Usage Examples
1. **Incident stabilization in workflows**
   - Input: noisy upstream payload requiring evolution continuous improvement planner normalization/assessment.
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
