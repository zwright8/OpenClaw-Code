---
name: u02061-tool-health-monitoring-for-design-and-user-research
description: Build and operate the "Tool Health Monitoring for design and user research" capability for design and user research. Use when this exact capability is required by autonomous or human-guided missions.
---

# Tool Health Monitoring for design and user research

## Why This Skill Exists
Use tool health monitoring in design and user research with emphasis on evidence quality, falsifiability, and calibration.

## Step-by-Step Implementation Guide
1. Define measurable outcomes for Tool Health Monitoring for design and user research, including baseline and target metrics for design and user research.
2. Specify structured inputs/outputs for tool health monitoring and validate schema contract edge cases.
3. Implement the core tool health monitoring logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Tool Health Monitoring for design and user research under maximally truth-seeking conditions.
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
- [quality] Require unit and integration validations before promoting Tool Health Monitoring for design and user research. -> `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. -> `rollback:rollback-to-last-stable-baseline`
- [compliance] Require policy and approval gates prior to autonomous deployment. -> `approval-gates:policy-constraint-check+evidence-review`
- [cost] Respect bounded resource pressure and execution budget during scaling. -> `budget-guard:resource-pressure-cap`
