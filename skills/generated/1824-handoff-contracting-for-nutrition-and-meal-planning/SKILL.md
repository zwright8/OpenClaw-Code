---
name: u01824-handoff-contracting-for-nutrition-and-meal-planning
description: Build and operate the "Handoff Contracting for nutrition and meal planning" capability for nutrition and meal planning. Use when this exact capability is required by autonomous or human-guided missions.
---

# Handoff Contracting for nutrition and meal planning

## Why This Skill Exists
Use handoff contracting in nutrition and meal planning with emphasis on throughput, reliability, leverage, and execution speed.

## When To Use
Use this skill when the request explicitly needs "Handoff Contracting for nutrition and meal planning" outcomes in the nutrition and meal planning domain.

## Step-by-Step Implementation Guide
1. Define measurable outcomes for Handoff Contracting for nutrition and meal planning, including baseline and target metrics for nutrition and meal planning.
2. Specify structured inputs/outputs for handoff contracting and validate schema contract edge cases.
3. Implement the core handoff contracting logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Handoff Contracting for nutrition and meal planning under hyper-productive autonomy conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Runtime profile: generalist-engine using handoff contracting to produce handoff-contracting-artifact-nutrition-and-meal-planning.
- Orchestration integration: nutrition-and-meal-planning:generalist-engine routing, approval gates, retries, and rollback controls.
- Validation evidence: unit, integration, simulation, regression-baseline suites and rollout telemetry.

## Operational Runbook
### Preflight
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

### Execution
- Execute handoff contracting workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

### Recovery
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

### Handoff
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Guardrails
- [quality] Require unit and integration validations before promoting Handoff Contracting for nutrition and meal planning. -> `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. -> `rollback:rollback-to-last-stable-baseline`
- [compliance] Require policy and approval gates prior to autonomous deployment. -> `approval-gates:policy-constraint-check+human-approval-router`
- [cost] Respect bounded resource pressure and execution budget during scaling. -> `budget-guard:resource-pressure-cap`
