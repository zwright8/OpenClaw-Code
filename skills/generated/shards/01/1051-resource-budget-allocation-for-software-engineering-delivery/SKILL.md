---
name: u01051-resource-budget-allocation-for-software-engineering-delivery
description: Build and operate the "Resource Budget Allocation for software engineering delivery" capability for software engineering delivery. Use when this exact capability is required by autonomous or human-guided missions.
---

# Resource Budget Allocation for software engineering delivery

## Why This Skill Exists
Use resource budget allocation in software engineering delivery with emphasis on evidence quality, falsifiability, and calibration.

## Step-by-Step Implementation Guide
1. Define measurable outcomes for Resource Budget Allocation for software engineering delivery, including baseline and target metrics for software engineering delivery.
2. Specify structured inputs/outputs for resource budget allocation and validate schema contract edge cases.
3. Implement the core resource budget allocation logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Resource Budget Allocation for software engineering delivery under maximally truth-seeking conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
Preflight:
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

Execution:
- Execute resource budget allocation workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

Recovery:
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

Handoff:
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Guardrails
- [quality] Require unit and integration validations before promoting Resource Budget Allocation for software engineering delivery. -> `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. -> `rollback:rollback-to-last-stable-baseline`
- [cost] Respect bounded resource pressure and execution budget during scaling. -> `budget-guard:resource-pressure-cap`

## Trigger Checklist
- [ ] The request explicitly needs **Resource Budget Allocation for software engineering delivery** outcomes (not generic brainstorming).
- [ ] Inputs are sufficient to execute in **software engineering delivery" capability for software engineering delivery** with measurable acceptance criteria.
- [ ] A downstream consumer is identified for the output artifacts (operator/orchestrator/audit log).
- [ ] If any item is false, route to discovery/scoping first instead of invoking this skill.

## Operational Cadence (Day / Week / Month)
- **Daily:** Run when new software engineering delivery" capability for software engineering delivery signals arrive or when active decisions depend on this capability.
- **Weekly:** Review thresholds, drift, and failure telemetry; calibrate decision rules and retry policy.
- **Monthly:** Re-baseline deterministic expectations, archive evidence, and refresh approval/handoff assumptions.

## Practical Usage Examples
1. **Incident stabilization in software engineering delivery" capability for software engineering delivery**
   - Input: noisy upstream payload requiring resource budget allocation for software engineering delivery normalization/assessment.
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
- Produces: `Resource Budget Allocation for software engineering delivery` execution artifacts + scorecard + risk/confidence metadata.
- Consumes: validated upstream payloads that satisfy schema and policy checks.
- Downstream routing hint: route only to declared consumers with gate/approval context attached.

## When To Use
Use this when a request in **software engineering delivery" capability for software engineering delivery** depends on **Resource Budget Allocation for software engineering delivery** outcomes with explicit acceptance criteria. Do not use for unconstrained ideation; route discovery work before invoking this execution skill.
