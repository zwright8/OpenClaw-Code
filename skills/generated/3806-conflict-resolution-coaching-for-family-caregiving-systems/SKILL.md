---
name: u03806-conflict-resolution-coaching-for-family-caregiving-systems
description: Build and operate the "Conflict Resolution Coaching for family caregiving systems" capability for family caregiving systems. Use when this exact capability is required by autonomous or human-guided missions.
---

# Conflict Resolution Coaching for family caregiving systems

## Why This Skill Exists
Use conflict resolution coaching in family caregiving systems with emphasis on evidence quality, falsifiability, and calibration.

## Step-by-Step Implementation Guide
1. Define measurable outcomes for Conflict Resolution Coaching for family caregiving systems, including baseline and target metrics for family caregiving systems.
2. Specify structured inputs/outputs for conflict resolution coaching and validate schema contract edge cases.
3. Implement the core conflict resolution coaching logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Conflict Resolution Coaching for family caregiving systems under maximally truth-seeking conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
Preflight:
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

Execution:
- Execute conflict resolution coaching workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

Recovery:
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

Handoff:
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Guardrails
- [quality] Require unit and integration validations before promoting Conflict Resolution Coaching for family caregiving systems. -> `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. -> `rollback:rollback-to-last-stable-baseline`
- [cost] Respect bounded resource pressure and execution budget during scaling. -> `budget-guard:resource-pressure-cap`
