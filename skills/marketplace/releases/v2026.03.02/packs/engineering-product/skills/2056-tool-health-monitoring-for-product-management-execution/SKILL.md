---
name: openclaw-2056-tool-health-monitoring
description: Tool Health Monitoring for product management execution. Use when work requires tool health monitoring for product management execution with guardrails, traceable execution, and measurable outcomes.
---

# Tool Health Monitoring for product management execution

## Mission
Use tool health monitoring in product management execution with emphasis on evidence quality, falsifiability, and calibration.

## Activation Cues
- Task requires tool health monitoring in product management execution.
- Task needs explicit risk controls, approval gates, and traceable outcomes.
- Task output must include artifact handoff for humans and agents.

## Execution Plan
1. Define measurable outcomes for Tool Health Monitoring for product management execution, including baseline and target metrics for product management execution.
2. Specify structured inputs/outputs for tool health monitoring and validate schema contract edge cases.
3. Implement the core tool health monitoring logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Tool Health Monitoring for product management execution under maximally truth-seeking conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Runbook
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
- [quality] Require unit and integration validations before promoting Tool Health Monitoring for product management execution. Automation: `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. Automation: `rollback:rollback-to-last-stable-baseline`
- [cost] Respect bounded resource pressure and execution budget during scaling. Automation: `budget-guard:resource-pressure-cap`

## Success Metrics
- Primary metric: accuracy lift
- Secondary metrics: contradiction reduction, evidence coverage in product management execution
- Review cadence: weekly

## Output Contract
- Return a concise execution summary with key decisions.
- Return risk and mitigation notes with unresolved blockers.
- Return artifact target: `tool-health-monitoring-artifact-product-management-execution`.
- Return recommended follow-up tasks for next wave execution.
