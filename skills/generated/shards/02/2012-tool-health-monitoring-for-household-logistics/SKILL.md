---
name: u02012-tool-health-monitoring-for-household-logistics
description: Build and operate the "Tool Health Monitoring for household logistics" capability for household logistics. Use when this exact capability is required by autonomous or human-guided missions.
---

# Tool Health Monitoring for household logistics

## Why This Skill Exists
Use tool health monitoring in household logistics with emphasis on safety, dignity, equity, and long-term societal benefit.

## Step-by-Step Implementation Guide
1. Define measurable outcomes for Tool Health Monitoring for household logistics, including baseline and target metrics for household logistics.
2. Specify structured inputs/outputs for tool health monitoring and validate schema contract edge cases.
3. Implement the core tool health monitoring logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Tool Health Monitoring for household logistics under pro-humanity impact conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
Preflight:
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

Execution:
- Execute tool health monitoring workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

Recovery:
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

Handoff:
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Guardrails
- [quality] Require unit and integration validations before promoting Tool Health Monitoring for household logistics. -> `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. -> `rollback:rollback-to-last-stable-baseline`
- [compliance] Require policy and approval gates prior to autonomous deployment. -> `approval-gates:policy-constraint-check+human-impact-review`
- [cost] Respect bounded resource pressure and execution budget during scaling. -> `budget-guard:resource-pressure-cap`
