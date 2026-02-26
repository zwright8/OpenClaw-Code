---
name: u03529-plan-quality-evaluation-for-cybersecurity-operations
description: Build and operate the "Plan Quality Evaluation for cybersecurity operations" capability for cybersecurity operations. Use when this exact capability is required by autonomous or human-guided missions.
---

# Plan Quality Evaluation for cybersecurity operations

## Why This Skill Exists
Use plan quality evaluation in cybersecurity operations with emphasis on throughput, reliability, leverage, and execution speed.

## Step-by-Step Implementation Guide
1. Define measurable outcomes for Plan Quality Evaluation for cybersecurity operations, including baseline and target metrics for cybersecurity operations.
2. Specify structured inputs/outputs for plan quality evaluation and validate schema contract edge cases.
3. Implement the core plan quality evaluation logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Plan Quality Evaluation for cybersecurity operations under hyper-productive autonomy conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
Preflight:
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

Execution:
- Execute plan quality evaluation workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

Recovery:
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

Handoff:
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Guardrails
- [quality] Require unit and integration validations before promoting Plan Quality Evaluation for cybersecurity operations. -> `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. -> `rollback:rollback-to-last-stable-baseline`
- [compliance] Require policy and approval gates prior to autonomous deployment. -> `approval-gates:policy-constraint-check+human-approval-router`
- [safety] Block production action when risk posture is critical until human oversight review. -> `open-incident:human-oversight`
