---
name: u09106-public-service-coordination-for-urban-planning-and-mobility
description: Build and operate the "Public Service Coordination for urban planning and mobility" capability for urban planning and mobility. Use when this exact capability is required by autonomous or human-guided missions.
---

# Public Service Coordination for urban planning and mobility

## Why This Skill Exists
Use public service coordination in urban planning and mobility with emphasis on evidence quality, falsifiability, and calibration.

## Step-by-Step Implementation Guide
1. Define measurable outcomes for Public Service Coordination for urban planning and mobility, including baseline and target metrics for urban planning and mobility.
2. Specify structured inputs/outputs for public service coordination and validate schema contract edge cases.
3. Implement the core public service coordination logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Public Service Coordination for urban planning and mobility under maximally truth-seeking conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
Preflight:
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

Execution:
- Execute public service coordination workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

Recovery:
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

Handoff:
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Guardrails
- [quality] Require unit and integration validations before promoting Public Service Coordination for urban planning and mobility. -> `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. -> `rollback:rollback-to-last-stable-baseline`
- [compliance] Require policy and approval gates prior to autonomous deployment. -> `approval-gates:policy-constraint-check+evidence-review`
- [cost] Respect bounded resource pressure and execution budget during scaling. -> `budget-guard:resource-pressure-cap`
