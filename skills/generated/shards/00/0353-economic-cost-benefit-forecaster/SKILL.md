---
name: u0353-economic-cost-benefit-forecaster
description: Build and operate the "Economic Cost-Benefit Forecaster" capability for Economic Optimization. Use when outcomes in this capability family are required for production execution.
---

# Economic Cost-Benefit Forecaster

## Why This Skill Exists
We need this skill because missions need explicit tradeoff logic for cost, speed, and impact. This specific skill prioritizes actions with the strongest net value.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Economic Cost-Benefit Forecaster`, including at least three measurable KPIs tied to overspending and low-impact allocation.
2. Design and version the input/output contract for budgets, costs, benefits, and opportunity values, then add schema validation and failure-mode handling.
3. Implement the core capability using cost-impact simulation, and produce forecasted ROI scenarios with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover overspending and low-impact allocation, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Metadata
- **Skill ID:** `353`
- **Skill Name:** `u0353-economic-cost-benefit-forecaster`
- **Domain:** `Economic Optimization`
- **Domain Slug:** `economic-optimization`
- **Archetype:** `simulation-lab`
- **Core Method:** `cost-impact simulation`
- **Primary Artifact:** `forecasted ROI scenarios`
- **Routing Tag:** `economic-optimization:simulation-lab`
- **Feature Flag:** `skill_0353_economic-cost-benefit-forecaster`
- **Release Cycles:** `2`

## Allowed Tools
- `read`, `write`, `edit` for contract maintenance, runbook updates, and handoff documentation.
- `exec`, `process` for deterministic execution, validation suites, and regression checks.
- `web_search`, `web_fetch` only when fresh external evidence is required for claims/evidence inputs.
- Use messaging or publishing tools only after policy approval gates are satisfied.

## Inputs (formatted)
| name | type | required | source |
|---|---|---|---|
| budgets | signal | true | upstream |
| costs | signal | true | upstream |
| benefits | signal | true | upstream |
| opportunity values | signal | true | upstream |
| claims | signal | true | upstream |
| evidence | signal | true | upstream |
| confidence traces | signal | true | upstream |

## Outputs (formatted)
| name | type | guaranteed | consumer |
|---|---|---|---|
| forecasted_roi_scenarios_report | structured-report | true | orchestrator |
| forecasted_roi_scenarios_scorecard | scorecard | true | operator |

## Guidelines
1. Validate required inputs before execution and reject non-conforming payloads early.
2. Run `cost-impact simulation` with deterministic settings and trace capture enabled.
3. Produce `forecasted ROI scenarios` outputs in machine-readable form for orchestrator/operator use.
4. Keep routing aligned with `economic-optimization:simulation-lab` and include approval context.
5. Tune thresholds incrementally based on observed KPI drift and incident learnings.

## Musts
- Enforce approval gates: `policy-constraint-check`, `human-approval-router`, `budget-review`, `scenario-review`.
- Apply retry policy: maxAttempts=`4`, baseDelayMs=`1050`, backoff=`exponential`.
- Run validation suites before release: `unit`, `integration`, `simulation`, `regression-baseline`.
- Fail closed when validation gates fail and execute rollback strategy `rollback-to-last-stable-baseline`.
- Preserve reproducible evidence artifacts for audits and downstream handoff.

## Targets (day/week/month operating cadence)
- **Day:** Validate new upstream signals, execute deterministic run, and hand off outputs for active decisions.
- **Week:** Review KPI focus (`overspending`, `low-impact allocation`, `decision drift`), failure trends, and approval/retry performance.
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
- `schema-contract-check`: All required input signals present and schema-valid (on fail: `quarantine`)
- `determinism-check`: Repeated run on same inputs yields stable scoring and artifacts (on fail: `escalate`)
- `policy-approval-check`: Approval gates satisfied before publish-level outputs (on fail: `retry`)

### Validation Suites
- `unit`
- `integration`
- `simulation`
- `regression-baseline`

### Failure Handling
- `E_INPUT_SCHEMA`: Missing or malformed required signals → Reject payload, emit validation error, request corrected payload
- `E_NON_DETERMINISM`: Determinism delta exceeds allowed threshold → Freeze output, escalate to human approval router
- `E_DEPENDENCY_TIMEOUT`: Downstream or external dependency timeout → Apply retry policy then rollback to last stable baseline

### Handoff Contract
- **Produces:** `Economic Cost-Benefit Forecaster normalized artifacts`, `execution scorecard`, `risk posture`
- **Consumes:** `budgets`, `costs`, `benefits`, `opportunity values`, `claims`, `evidence`, `confidence traces`
- **Downstream Hint:** Route next to economic-optimization:simulation-lab consumers with approval-gate context
