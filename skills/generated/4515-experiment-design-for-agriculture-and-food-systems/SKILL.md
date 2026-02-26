---
name: u04515-experiment-design-for-agriculture-and-food-systems
description: Build and operate the "Experiment Design for agriculture and food systems" capability for agriculture and food systems. Use when this exact capability is required by autonomous or human-guided missions.
---

# Experiment Design for agriculture and food systems

## Why This Skill Exists
Use experiment design in agriculture and food systems with emphasis on best-in-class standards, precision, and repeatable excellence.

## Step-by-Step Implementation Guide
1. Define measurable outcomes for Experiment Design for agriculture and food systems, including baseline and target metrics for agriculture and food systems.
2. Specify structured inputs/outputs for experiment design and validate schema contract edge cases.
3. Implement the core experiment design logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Experiment Design for agriculture and food systems under professional mastery conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
Preflight:
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

Execution:
- Execute experiment design workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

Recovery:
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

Handoff:
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Guardrails
- [quality] Require unit and integration validations before promoting Experiment Design for agriculture and food systems. -> `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. -> `rollback:rollback-to-last-stable-baseline`
- [compliance] Require policy and approval gates prior to autonomous deployment. -> `approval-gates:policy-constraint-check+human-approval-router`
- [cost] Respect bounded resource pressure and execution budget during scaling. -> `budget-guard:resource-pressure-cap`
