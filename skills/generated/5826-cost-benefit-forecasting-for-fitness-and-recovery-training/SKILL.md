---
name: u05826-cost-benefit-forecasting-for-fitness-and-recovery-training
description: Build and operate the "Cost-Benefit Forecasting for fitness and recovery training" capability for fitness and recovery training. Use when this exact capability is required by autonomous or human-guided missions.
---

# Cost-Benefit Forecasting for fitness and recovery training

## Why This Skill Exists
Use cost-benefit forecasting in fitness and recovery training with emphasis on evidence quality, falsifiability, and calibration.

## Step-by-Step Implementation Guide
1. Define measurable outcomes for Cost-Benefit Forecasting for fitness and recovery training, including baseline and target metrics for fitness and recovery training.
2. Specify structured inputs/outputs for cost-benefit forecasting and validate schema contract edge cases.
3. Implement the core cost-benefit forecasting logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Cost-Benefit Forecasting for fitness and recovery training under maximally truth-seeking conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
Preflight:
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

Execution:
- Execute cost-benefit forecasting workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

Recovery:
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

Handoff:
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Guardrails
- [quality] Require unit and integration validations before promoting Cost-Benefit Forecasting for fitness and recovery training. -> `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. -> `rollback:rollback-to-last-stable-baseline`
- [cost] Respect bounded resource pressure and execution budget during scaling. -> `budget-guard:resource-pressure-cap`
