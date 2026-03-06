---
name: openclaw-7476-autonomous-workflow-authoring
description: Autonomous Workflow Authoring for legal and policy workflows. Use when work requires autonomous workflow authoring for legal and policy workflows with guardrails, traceable execution, and measurable outcomes.
---

# Autonomous Workflow Authoring for legal and policy workflows

## Mission
Use autonomous workflow authoring in legal and policy workflows with emphasis on evidence quality, falsifiability, and calibration.

## Activation Cues
- Task requires autonomous workflow authoring in legal and policy workflows.
- Task needs explicit risk controls, approval gates, and traceable outcomes.
- Task output must include artifact handoff for humans and agents.

## Execution Plan
1. Define measurable outcomes for Autonomous Workflow Authoring for legal and policy workflows, including baseline and target metrics for legal and policy workflows.
2. Specify structured inputs/outputs for autonomous workflow authoring and validate schema contract edge cases.
3. Implement the core autonomous workflow authoring logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Autonomous Workflow Authoring for legal and policy workflows under maximally truth-seeking conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Runbook
Preflight:
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

Execution:
- Execute autonomous workflow authoring workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

Recovery:
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

Handoff:
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Guardrails
- [quality] Require unit and integration validations before promoting Autonomous Workflow Authoring for legal and policy workflows. Automation: `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. Automation: `rollback:rollback-to-last-stable-baseline`
- [compliance] Require policy and approval gates prior to autonomous deployment. Automation: `approval-gates:policy-constraint-check+evidence-review`
- [safety] Block production action when risk posture is critical until human oversight review. Automation: `open-incident:human-oversight`

## Success Metrics
- Primary metric: accuracy lift
- Secondary metrics: contradiction reduction, evidence coverage in legal and policy workflows
- Review cadence: daily

## Output Contract
- Return a concise execution summary with key decisions.
- Return risk and mitigation notes with unresolved blockers.
- Return artifact target: `autonomous-workflow-authoring-artifact-legal-and-policy-workflow`.
- Return recommended follow-up tasks for next wave execution.
