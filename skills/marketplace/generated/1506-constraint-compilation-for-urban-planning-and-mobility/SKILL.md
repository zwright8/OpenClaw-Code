---
name: openclaw-1506-constraint-compilation
description: Constraint Compilation for urban planning and mobility. Use when work requires constraint compilation for urban planning and mobility with guardrails, traceable execution, and measurable outcomes.
---

# Constraint Compilation for urban planning and mobility

## Mission
Use constraint compilation in urban planning and mobility with emphasis on evidence quality, falsifiability, and calibration.

## Activation Cues
- Task requires constraint compilation in urban planning and mobility.
- Task needs explicit risk controls, approval gates, and traceable outcomes.
- Task output must include artifact handoff for humans and agents.

## Execution Plan
1. Define measurable outcomes for Constraint Compilation for urban planning and mobility, including baseline and target metrics for urban planning and mobility.
2. Specify structured inputs/outputs for constraint compilation and validate schema contract edge cases.
3. Implement the core constraint compilation logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Constraint Compilation for urban planning and mobility under maximally truth-seeking conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Runbook
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
- [quality] Require unit and integration validations before promoting Constraint Compilation for urban planning and mobility. Automation: `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. Automation: `rollback:rollback-to-last-stable-baseline`
- [compliance] Require policy and approval gates prior to autonomous deployment. Automation: `approval-gates:policy-constraint-check+evidence-review`
- [cost] Respect bounded resource pressure and execution budget during scaling. Automation: `budget-guard:resource-pressure-cap`

## Success Metrics
- Primary metric: accuracy lift
- Secondary metrics: contradiction reduction, evidence coverage in urban planning and mobility
- Review cadence: weekly

## Output Contract
- Return a concise execution summary with key decisions.
- Return risk and mitigation notes with unresolved blockers.
- Return artifact target: `constraint-compilation-artifact-urban-planning-and-mobility`.
- Return recommended follow-up tasks for next wave execution.
