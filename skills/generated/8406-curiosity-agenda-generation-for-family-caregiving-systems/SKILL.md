---
name: u08406-curiosity-agenda-generation-for-family-caregiving-systems
description: Build and operate the "Curiosity Agenda Generation for family caregiving systems" capability for family caregiving systems. Use when this exact capability is required by autonomous or human-guided missions.
---

# Curiosity Agenda Generation for family caregiving systems

## Why This Skill Exists
Use curiosity agenda generation in family caregiving systems with emphasis on evidence quality, falsifiability, and calibration.

## When To Use
Use this skill when the request explicitly needs "Curiosity Agenda Generation for family caregiving systems" outcomes in the family caregiving systems domain.

## Step-by-Step Implementation Guide
1. Define measurable outcomes for Curiosity Agenda Generation for family caregiving systems, including baseline and target metrics for family caregiving systems.
2. Specify structured inputs/outputs for curiosity agenda generation and validate schema contract edge cases.
3. Implement the core curiosity agenda generation logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Curiosity Agenda Generation for family caregiving systems under maximally truth-seeking conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Runtime profile: curiosity-engine using curiosity agenda generation to produce curiosity-agenda-generation-artifact-family-caregiving-systems.
- Orchestration integration: family-caregiving-systems:curiosity-engine routing, approval gates, retries, and rollback controls.
- Validation evidence: unit, integration, simulation, regression-baseline suites and rollout telemetry.

## Operational Runbook
### Preflight
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

### Execution
- Execute curiosity agenda generation workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

### Recovery
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

### Handoff
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Guardrails
- [quality] Require unit and integration validations before promoting Curiosity Agenda Generation for family caregiving systems. -> `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. -> `rollback:rollback-to-last-stable-baseline`
- [cost] Respect bounded resource pressure and execution budget during scaling. -> `budget-guard:resource-pressure-cap`
