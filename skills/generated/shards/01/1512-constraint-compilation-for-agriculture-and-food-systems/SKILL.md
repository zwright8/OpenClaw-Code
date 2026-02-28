---
name: u01512-constraint-compilation-for-agriculture-and-food-systems
description: Operate the "Constraint Compilation for agriculture and food systems" capability in production for agriculture and food systems workflows. Use when mission execution explicitly requires this capability and outcomes must be reproducible, policy-gated, and handoff-ready.
---

# Constraint Compilation for agriculture and food systems

## Why This Skill Exists
Use constraint compilation in agriculture and food systems with emphasis on safety, dignity, equity, and long-term societal benefit.

## Step-by-Step Implementation Guide
1. Define measurable outcomes for Constraint Compilation for agriculture and food systems, including baseline and target metrics for agriculture and food systems.
2. Specify structured inputs/outputs for constraint compilation and validate schema contract edge cases.
3. Implement the core constraint compilation logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Constraint Compilation for agriculture and food systems under pro-humanity impact conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
Preflight:
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

Execution:
- Execute constraint compilation workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

Recovery:
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

Handoff:
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Guardrails
- [quality] Require unit and integration validations before promoting Constraint Compilation for agriculture and food systems. -> `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. -> `rollback:rollback-to-last-stable-baseline`
- [compliance] Require policy and approval gates prior to autonomous deployment. -> `approval-gates:policy-constraint-check+human-impact-review`
- [cost] Respect bounded resource pressure and execution budget during scaling. -> `budget-guard:resource-pressure-cap`

## Trigger Checklist
- [ ] The request explicitly needs **Constraint Compilation for agriculture and food systems** outcomes (not generic brainstorming).
- [ ] Inputs are sufficient to execute in **agriculture and food systems" capability in production for agriculture and food systems workflows** with measurable acceptance criteria.
- [ ] A downstream consumer is identified for the output artifacts (operator/orchestrator/audit log).
- [ ] If any item is false, route to discovery/scoping first instead of invoking this skill.

## Operational Cadence (Day / Week / Month)
- **Daily:** Run when new agriculture and food systems" capability in production for agriculture and food systems workflows signals arrive or when active decisions depend on this capability.
- **Weekly:** Review thresholds, drift, and failure telemetry; calibrate decision rules and retry policy.
- **Monthly:** Re-baseline deterministic expectations, archive evidence, and refresh approval/handoff assumptions.

## Practical Usage Examples
1. **Incident stabilization in agriculture and food systems" capability in production for agriculture and food systems workflows**
   - Input: noisy upstream payload requiring constraint compilation for agriculture and food systems normalization/assessment.
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

## Output Contract
- `primary_artifact_bundle` (structured-report, consumer=orchestrator, guaranteed=true)
- `execution_scorecard` (scorecard, consumer=operator, guaranteed=true)
- `handoff_packet` (machine-readable, consumer=downstream-skill, guaranteed=true)

## Validation Gates
1. **schema-contract-check** — Required inputs are present and schema-valid (on fail: block).
2. **determinism-check** — Stable output under repeated runs on identical input (on fail: escalate).
3. **policy-approval-check** — Required approvals and policy constraints satisfied (on fail: block publish).

## Handoff Contract
- Produces: `Constraint Compilation for agriculture and food systems` execution artifacts + scorecard + risk/confidence metadata.
- Consumes: validated upstream payloads that satisfy schema and policy checks.
- Downstream routing hint: route only to declared consumers with gate/approval context attached.

## When To Use
Use this when a request in **agriculture and food systems" capability in production for agriculture and food systems workflows** depends on **Constraint Compilation for agriculture and food systems** outcomes with explicit acceptance criteria. Do not use for unconstrained ideation; route discovery work before invoking this execution skill.
