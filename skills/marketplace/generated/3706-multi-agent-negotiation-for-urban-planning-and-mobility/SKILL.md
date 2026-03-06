---
name: openclaw-3706-multi-agent-negotiation
description: Multi-Agent Negotiation for urban planning and mobility. Use when work requires multi-agent negotiation for urban planning and mobility with guardrails, traceable execution, and measurable outcomes.
---

# Multi-Agent Negotiation for urban planning and mobility

## Mission
Use multi-agent negotiation in urban planning and mobility with emphasis on evidence quality, falsifiability, and calibration.

## Activation Cues
- Task requires multi-agent negotiation in urban planning and mobility.
- Task needs explicit risk controls, approval gates, and traceable outcomes.
- Task output must include artifact handoff for humans and agents.

## Execution Plan
1. Define measurable outcomes for Multi-Agent Negotiation for urban planning and mobility, including baseline and target metrics for urban planning and mobility.
2. Specify structured inputs/outputs for multi-agent negotiation and validate schema contract edge cases.
3. Implement the core multi-agent negotiation logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Multi-Agent Negotiation for urban planning and mobility under maximally truth-seeking conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Runbook
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
- [quality] Require unit and integration validations before promoting Multi-Agent Negotiation for urban planning and mobility. Automation: `run-validation:unit+integration+simulation+regression-baseline`
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
- Return artifact target: `multi-agent-negotiation-artifact-urban-planning-and-mobility`.
- Return recommended follow-up tasks for next wave execution.
