---
name: u06199-equity-impact-scoring-for-knowledge-management-systems
description: Build and operate the "Equity Impact Scoring for knowledge management systems" capability for knowledge management systems. Use when this exact capability is required by autonomous or human-guided missions.
---

# Equity Impact Scoring for knowledge management systems

## Why This Skill Exists
Use equity impact scoring in knowledge management systems with emphasis on throughput, reliability, leverage, and execution speed.

## Step-by-Step Implementation Guide
1. Define measurable outcomes for Equity Impact Scoring for knowledge management systems, including baseline and target metrics for knowledge management systems.
2. Specify structured inputs/outputs for equity impact scoring and validate schema contract edge cases.
3. Implement the core equity impact scoring logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Equity Impact Scoring for knowledge management systems under hyper-productive autonomy conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
Preflight:
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

Execution:
- Execute equity impact scoring workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

Recovery:
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

Handoff:
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Guardrails
- [quality] Require unit and integration validations before promoting Equity Impact Scoring for knowledge management systems. -> `run-validation:unit+integration+simulation+regression-baseline`
- [reliability] Trigger rollback on critical posture or repeated failures. -> `rollback:rollback-to-last-stable-baseline`
- [cost] Respect bounded resource pressure and execution budget during scaling. -> `budget-guard:resource-pressure-cap`
