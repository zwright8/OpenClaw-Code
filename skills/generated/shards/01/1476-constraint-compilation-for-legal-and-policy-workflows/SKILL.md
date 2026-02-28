---
name: u01476-constraint-compilation-for-legal-and-policy-workflows
description: Operate the "Constraint Compilation for legal and policy workflows" capability in production for legal and policy workflows workflows. Use when mission execution explicitly requires this capability and outcomes must be reproducible, policy-gated, and handoff-ready.
---

# Constraint Compilation for legal and policy workflows

## Why This Skill Exists
Use constraint compilation in legal and policy workflows with emphasis on evidence quality, falsifiability, and calibration.

## Step-by-Step Implementation Guide
1. Define measurable outcomes for Constraint Compilation for legal and policy workflows, including baseline and target metrics for legal and policy workflows.
2. Specify structured inputs/outputs for constraint compilation and validate schema contract edge cases.
3. Implement the core constraint compilation logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Constraint Compilation for legal and policy workflows under maximally truth-seeking conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Metadata
- **Skill ID:** `1476`
- **Skill Name:** `u01476-constraint-compilation-for-legal-and-policy-workflows`
- **Domain:** `legal and policy workflows`
- **Domain Slug:** `legal-and-policy-workflows`
- **Archetype:** `generalist-engine`
- **Core Method:** `constraint compilation`
- **Primary Artifact:** `constraint-compilation-artifact-legal-and-policy-workflows`
- **Routing Tag:** `legal-and-policy-workflows:generalist-engine`
- **Feature Flag:** `skill_01476_constraint-compilation`
- **Release Cycles:** `2`

## Allowed Tools
- `read`, `write`, `edit` for contract maintenance, runbook updates, and handoff documentation.
- `exec`, `process` for deterministic execution, validation suites, and regression checks.
- `web_search`, `web_fetch` only when fresh external evidence is required for claims/evidence inputs.
- Use messaging or publishing tools only after policy approval gates are satisfied.

## Inputs (formatted)
| name | type | required | source |
|---|---|---|---|
| (none) | - | - | - |

## Outputs (formatted)
| name | type | guaranteed | consumer |
|---|---|---|---|
| (none) | - | - | - |

## Guidelines
1. Validate required inputs before execution and reject non-conforming payloads early.
2. Run `constraint compilation` with deterministic settings and trace capture enabled.
3. Produce `constraint-compilation-artifact-legal-and-policy-workflows` outputs in machine-readable form for orchestrator/operator use.
4. Keep routing aligned with `legal-and-policy-workflows:generalist-engine` and include approval context.
5. Tune thresholds incrementally based on observed KPI drift and incident learnings.

## Musts
- Enforce approval gates: `policy-constraint-check`, `evidence-review`.
- Apply retry policy: maxAttempts=`4`, baseDelayMs=`750`, backoff=`exponential`.
- Run validation suites before release: `unit`, `integration`, `simulation`, `regression-baseline`.
- Fail closed when validation gates fail and execute rollback strategy `rollback-to-last-stable-baseline`.
- Preserve reproducible evidence artifacts for audits and downstream handoff.

## Targets (day/week/month operating cadence)
- **Day:** Validate new upstream signals, execute deterministic run, and hand off outputs for active decisions.
- **Week:** Review KPI focus (`accuracy lift`, `contradiction reduction`, `evidence coverage in legal and policy workflows`), failure trends, and approval/retry performance.
- **Month:** Re-baseline deterministic expectations, confirm policy alignment, and refresh feature-flag/rollout posture.

## Common Actions
1. **Intake Check:** Confirm all required signals are present and schema-valid.
2. **Core Execution:** Run the capability pipeline and generate report + scorecard artifacts.
3. **Gate Review:** Evaluate validation and approval gates before publish-level handoff.
4. **Recovery:** Retry transient failures, then rollback to stable baseline on persistent errors.
5. **Handoff:** Send artifacts with risk/confidence metadata and downstream routing hints.

## External Tool Calls Needed
- None required by default.
- If external systems are introduced for a run, record the dependency, timeout budget, and retry behavior in execution notes.

## Validation & Handoff
### Validation Gates
- (none declared)

### Validation Suites
- `unit`
- `integration`
- `simulation`
- `regression-baseline`

### Failure Handling
- (none declared)

### Handoff Contract
- **Produces:** (none declared)
- **Consumes:** (none declared)
- **Downstream Hint:** (none declared)
