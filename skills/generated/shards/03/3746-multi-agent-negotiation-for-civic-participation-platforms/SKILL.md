---
name: u03746-multi-agent-negotiation-for-civic-participation-platforms
description: Build and operate the "Multi-Agent Negotiation for civic participation platforms" capability for civic participation platforms. Use when this exact capability is required by autonomous or human-guided missions.
---

# Multi-Agent Negotiation for civic participation platforms

## Why This Skill Exists
Use multi-agent negotiation in civic participation platforms with emphasis on evidence quality, falsifiability, and calibration.

## Step-by-Step Implementation Guide
1. Define measurable outcomes for Multi-Agent Negotiation for civic participation platforms, including baseline and target metrics for civic participation platforms.
2. Specify structured inputs/outputs for multi-agent negotiation and validate schema contract edge cases.
3. Implement the core multi-agent negotiation logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Multi-Agent Negotiation for civic participation platforms under maximally truth-seeking conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
Preflight:
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

Execution:
- Execute multi-agent negotiation workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

Recovery:
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

Handoff:
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Guardrails
- [quality] Require unit and integration validations before promoting Multi-Agent Negotiation for civic participation platforms. -> `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. -> `rollback:rollback-to-last-stable-baseline`
- [cost] Respect bounded resource pressure and execution budget during scaling. -> `budget-guard:resource-pressure-cap`
