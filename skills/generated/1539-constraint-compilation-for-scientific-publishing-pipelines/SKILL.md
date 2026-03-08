---
name: u01539-constraint-compilation-for-scientific-publishing-pipelines
description: Build and operate the "Constraint Compilation for scientific publishing pipelines" capability for scientific publishing pipelines. Use when this exact capability is required by autonomous or human-guided missions.
---

# Constraint Compilation for scientific publishing pipelines

## Why This Skill Exists
Use constraint compilation in scientific publishing pipelines with emphasis on throughput, reliability, leverage, and execution speed.

## Step-by-Step Implementation Guide
1. Define measurable outcomes for Constraint Compilation for scientific publishing pipelines, including baseline and target metrics for scientific publishing pipelines.
2. Specify structured inputs/outputs for constraint compilation and validate schema contract edge cases.
3. Implement the core constraint compilation logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Constraint Compilation for scientific publishing pipelines under hyper-productive autonomy conditions.
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
- [quality] Require unit and integration validations before promoting Constraint Compilation for scientific publishing pipelines. -> `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. -> `rollback:rollback-to-last-stable-baseline`
- [cost] Respect bounded resource pressure and execution budget during scaling. -> `budget-guard:resource-pressure-cap`
