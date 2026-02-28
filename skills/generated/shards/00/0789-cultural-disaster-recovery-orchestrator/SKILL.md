---
name: u0789-cultural-disaster-recovery-orchestrator
description: Operate the "Cultural Disaster Recovery Orchestrator" capability in production for  workflows. Use when mission execution explicitly requires this capability and outcomes must be reproducible, policy-gated, and handoff-ready.
---

# Cultural Disaster Recovery Orchestrator

## Why This Skill Exists
We need this skill because global utility requires language and cultural context fidelity. This specific skill improves recovery speed after severe outages.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Cultural Disaster Recovery Orchestrator`, including at least three measurable KPIs tied to context mismatch and exclusion.
2. Design and version the input/output contract for language variants, cultural norms, and local preferences, then add schema validation and failure-mode handling.
3. Implement the core capability using failover and restoration sequencing, and produce recovery mission plans with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover context mismatch and exclusion, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Metadata
- **Skill ID:** `789`
- **Skill Name:** `u0789-cultural-disaster-recovery-orchestrator`
- **Domain:** `Multilingual and Cultural Adaptation`
- **Domain Slug:** `multilingual-and-cultural-adaptation`
- **Archetype:** `general-capability`
- **Core Method:** `failover and restoration sequencing`
- **Primary Artifact:** `recovery mission plans`
- **Routing Tag:** `multilingual-and-cultural-adaptation:general-capability`
- **Feature Flag:** `skill_0789_cultural-disaster-recovery-orche`
- **Release Cycles:** `2`

## Allowed Tools
- `read`, `write`, `edit` for contract maintenance, runbook updates, and handoff documentation.
- `exec`, `process` for deterministic execution, validation suites, and regression checks.
- `web_search`, `web_fetch` only when fresh external evidence is required for claims/evidence inputs.
- Use messaging or publishing tools only after policy approval gates are satisfied.

## Inputs (formatted)
| name | type | required | source |
|---|---|---|---|
| language variants | signal | true | upstream |
| cultural norms | signal | true | upstream |
| local preferences | signal | true | upstream |
| claims | signal | true | upstream |
| evidence | signal | true | upstream |
| confidence traces | signal | true | upstream |

## Outputs (formatted)
| name | type | guaranteed | consumer |
|---|---|---|---|
| recovery_mission_plans_report | structured-report | true | orchestrator |
| recovery_mission_plans_scorecard | scorecard | true | operator |

## Guidelines
1. Validate required inputs before execution and reject non-conforming payloads early.
2. Run `failover and restoration sequencing` with deterministic settings and trace capture enabled.
3. Produce `recovery mission plans` outputs in machine-readable form for orchestrator/operator use.
4. Keep routing aligned with `multilingual-and-cultural-adaptation:general-capability` and include approval context.
5. Tune thresholds incrementally based on observed KPI drift and incident learnings.

## Musts
- Enforce approval gates: `policy-constraint-check`, `human-approval-router`.
- Apply retry policy: maxAttempts=`4`, baseDelayMs=`1200`, backoff=`exponential`.
- Run validation suites before release: `unit`, `integration`, `simulation`, `regression-baseline`.
- Fail closed when validation gates fail and execute rollback strategy `rollback-to-last-stable-baseline`.
- Preserve reproducible evidence artifacts for audits and downstream handoff.

## Targets (day/week/month operating cadence)
- **Day:** Validate new upstream signals, execute deterministic run, and hand off outputs for active decisions.
- **Week:** Review KPI focus (`context mismatch`, `exclusion`, `decision drift`), failure trends, and approval/retry performance.
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
- **Produces:** `Cultural Disaster Recovery Orchestrator normalized artifacts`, `execution scorecard`, `risk posture`
- **Consumes:** `language variants`, `cultural norms`, `local preferences`, `claims`, `evidence`, `confidence traces`
- **Downstream Hint:** Route next to multilingual-and-cultural-adaptation:general-capability consumers with approval-gate context
