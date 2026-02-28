---
name: u0186-governance-experiment-design-generator
description: Build and operate the "Governance Experiment Design Generator" capability for Safety and Governance. Use only when production execution explicitly requires this exact capability and output contract.
---

# Governance Experiment Design Generator

## Why This Skill Exists
We need this skill because high-speed autonomy needs enforceable guardrails to stay aligned. This specific skill converts unknowns into testable learning loops.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Governance Experiment Design Generator`, including at least three measurable KPIs tied to unsafe actions and policy drift.
2. Design and version the input/output contract for policies, violations, and mitigation actions, then add schema validation and failure-mode handling.
3. Implement the core capability using hypothesis-driven design, and produce experiment plans with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover unsafe actions and policy drift, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Metadata
- **Skill ID:** `186`
- **Skill Name:** `u0186-governance-experiment-design-generator`
- **Domain:** `Safety and Governance`
- **Domain Slug:** `safety-and-governance`
- **Archetype:** `general-capability`
- **Core Method:** `hypothesis-driven design`
- **Primary Artifact:** `experiment plans`
- **Routing Tag:** `safety-and-governance:general-capability`
- **Feature Flag:** `skill_0186_governance-experiment-design-gen`
- **Release Cycles:** `2`

## Allowed Tools
- `read`, `write`, `edit` for contract maintenance, runbook updates, and handoff documentation.
- `exec`, `process` for deterministic execution, validation suites, and regression checks.
- `web_search`, `web_fetch` only when fresh external evidence is required for claims/evidence inputs.
- Use messaging or publishing tools only after policy approval gates are satisfied.

## Inputs (formatted)
| name | type | required | source |
|---|---|---|---|
| policies | signal | true | upstream |
| violations | signal | true | upstream |
| mitigation actions | signal | true | upstream |
| claims | signal | true | upstream |
| evidence | signal | true | upstream |
| confidence traces | signal | true | upstream |

## Outputs (formatted)
| name | type | guaranteed | consumer |
|---|---|---|---|
| experiment_plans_report | structured-report | true | orchestrator |
| experiment_plans_scorecard | scorecard | true | operator |

## Guidelines
1. Validate required inputs before execution and reject non-conforming payloads early.
2. Run `hypothesis-driven design` with deterministic settings and trace capture enabled.
3. Produce `experiment plans` outputs in machine-readable form for orchestrator/operator use.
4. Keep routing aligned with `safety-and-governance:general-capability` and include approval context.
5. Tune thresholds incrementally based on observed KPI drift and incident learnings.

## Musts
- Enforce approval gates: `policy-constraint-check`, `human-approval-router`, `safety-review`.
- Apply retry policy: maxAttempts=`3`, baseDelayMs=`750`, backoff=`exponential`.
- Run validation suites before release: `unit`, `integration`, `simulation`, `regression-baseline`.
- Fail closed when validation gates fail and execute rollback strategy `rollback-to-last-stable-baseline`.
- Preserve reproducible evidence artifacts for audits and downstream handoff.

## Targets (day/week/month operating cadence)
- **Day:** Validate new upstream signals, execute deterministic run, and hand off outputs for active decisions.
- **Week:** Review KPI focus (`unsafe actions`, `policy drift`, `decision drift`), failure trends, and approval/retry performance.
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
- **Produces:** `Governance Experiment Design Generator normalized artifacts`, `execution scorecard`, `risk posture`
- **Consumes:** `policies`, `violations`, `mitigation actions`, `claims`, `evidence`, `confidence traces`
- **Downstream Hint:** Route next to safety-and-governance:general-capability consumers with approval-gate context
