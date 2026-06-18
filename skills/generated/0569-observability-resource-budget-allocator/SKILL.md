---
name: u0569-observability-resource-budget-allocator
description: Build and operate the "Observability Resource Budget Allocator" capability for Data Quality and Observability. Trigger when this exact capability is needed in mission execution.
---

# Observability Resource Budget Allocator

## Why This Skill Exists
We need this skill because decisions are only as good as the quality and visibility of data. This specific skill matches mission ambition to finite execution capacity.

## When To Use
Use this skill when the request explicitly needs "Observability Resource Budget Allocator" outcomes in the Data Quality and Observability domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Observability Resource Budget Allocator`, including at least three measurable KPIs tied to data drift and blind spots.
2. Design and version the input/output contract for freshness, drift, schema health, and telemetry coverage, then add schema validation and failure-mode handling.
3. Implement the core capability using capacity-aware allocation, and produce budgeted execution plans with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover data drift and blind spots, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Runtime profile: planning-router using capacity-aware allocation to produce budgeted execution plans.
- Orchestration integration: data-quality-and-observability:planning-router routing, approval gates, retries, and rollback controls.
- Validation evidence: unit, integration, simulation, regression-baseline suites and rollout telemetry.

## Operational Runbook
### Preflight
- Confirm the Observability Resource Budget Allocator request scope, source evidence, and measurable success criteria before execution.
- Verify feature flag skill_0569_observability-resource-budget-al, approval gates, and rollback owner before autonomous use.

### Execution
- Execute capacity-aware allocation with deterministic scoring and reproducible trace capture.
- Produce budgeted execution plans plus scorecard, assumptions, and unresolved-risk notes.

### Recovery
- Fail closed when required signals, evidence, or approval gates are missing.
- Rollback to the last stable baseline when posture is critical or validation fails.

### Handoff
- Publish budgeted execution plans, validation evidence, and telemetry links to downstream owners.
- Queue follow-up tasks for unresolved risks, threshold tuning, or approval review.

## Guardrails
- [quality] Require deterministic scoring and validation evidence before promotion.
- [reliability] Preserve retries, rollback controls, and failure-mode evidence for every run.
- [safety] Route critical posture or missing approval gates to human review before autonomous action.
