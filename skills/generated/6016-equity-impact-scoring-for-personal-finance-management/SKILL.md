---
name: u06016-equity-impact-scoring-for-personal-finance-management
description: Build and operate the "Equity Impact Scoring for personal finance management" capability for personal finance management. Use when this exact capability is required by autonomous or human-guided missions.
---

# Equity Impact Scoring for personal finance management

## Why This Skill Exists
Use equity impact scoring in personal finance management with emphasis on evidence quality, falsifiability, and calibration.

## Step-by-Step Implementation Guide
1. Define measurable outcomes for Equity Impact Scoring for personal finance management, including baseline and target metrics for personal finance management.
2. Specify structured inputs/outputs for equity impact scoring and validate schema contract edge cases.
3. Implement the core equity impact scoring logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Equity Impact Scoring for personal finance management under maximally truth-seeking conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
Preflight:
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

Execution:
- Execute equity impact scoring workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

Recovery:
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

Handoff:
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Guardrails
- [quality] Require unit and integration validations before promoting Equity Impact Scoring for personal finance management. -> `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. -> `rollback:rollback-to-last-stable-baseline`
- [compliance] Require policy and approval gates prior to autonomous deployment. -> `approval-gates:policy-constraint-check+evidence-review`
- [safety] Block production action when risk posture is critical until human oversight review. -> `open-incident:human-oversight`
