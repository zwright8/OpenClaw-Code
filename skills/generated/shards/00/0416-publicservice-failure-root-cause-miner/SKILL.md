---
name: u0416-publicservice-failure-root-cause-miner
description: Build and operate the "PublicService Failure Root-Cause Miner" capability for Healthcare and Public Services. Trigger when this exact capability is needed in mission execution.
---

# PublicService Failure Root-Cause Miner

## Why This Skill Exists
We need this skill because public-facing workflows require strict safety and reliability controls. This specific skill finds recurring break patterns to speed remediation.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `PublicService Failure Root-Cause Miner`, including at least three measurable KPIs tied to service harm and procedural violations.
2. Design and version the input/output contract for protocol checks, service queues, and compliance flags, then add schema validation and failure-mode handling.
3. Implement the core capability using error pattern mining, and produce root-cause clusters with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover service harm and procedural violations, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Metadata
- **Skill ID:** `416`
- **Skill Name:** `u0416-publicservice-failure-root-cause-miner`
- **Domain:** `Healthcare and Public Services`
- **Domain Slug:** `healthcare-and-public-services`
- **Archetype:** `general-capability`
- **Core Method:** `error pattern mining`
- **Primary Artifact:** `root-cause clusters`
- **Routing Tag:** `healthcare-and-public-services:general-capability`
- **Feature Flag:** `skill_0416_publicservice-failure-root-cause`
- **Release Cycles:** `2`

## Allowed Tools
- `read`, `write`, `edit` for contract maintenance, runbook updates, and handoff documentation.
- `exec`, `process` for deterministic execution, validation suites, and regression checks.
- `web_search`, `web_fetch` only when fresh external evidence is required for claims/evidence inputs.
- Use messaging or publishing tools only after policy approval gates are satisfied.

## Inputs (formatted)
| name | type | required | source |
|---|---|---|---|
| protocol checks | signal | true | upstream |
| service queues | signal | true | upstream |
| compliance flags | signal | true | upstream |
| claims | signal | true | upstream |
| evidence | signal | true | upstream |
| confidence traces | signal | true | upstream |

## Outputs (formatted)
| name | type | guaranteed | consumer |
|---|---|---|---|
| root_cause_clusters_report | structured-report | true | orchestrator |
| root_cause_clusters_scorecard | scorecard | true | operator |

## Guidelines
1. Validate required inputs before execution and reject non-conforming payloads early.
2. Run `error pattern mining` with deterministic settings and trace capture enabled.
3. Produce `root-cause clusters` outputs in machine-readable form for orchestrator/operator use.
4. Keep routing aligned with `healthcare-and-public-services:general-capability` and include approval context.
5. Tune thresholds incrementally based on observed KPI drift and incident learnings.

## Musts
- Enforce approval gates: `policy-constraint-check`, `human-approval-router`, `safety-review`.
- Apply retry policy: maxAttempts=`3`, baseDelayMs=`750`, backoff=`exponential`.
- Run validation suites before release: `unit`, `integration`, `simulation`, `regression-baseline`.
- Fail closed when validation gates fail and execute rollback strategy `rollback-to-last-stable-baseline`.
- Preserve reproducible evidence artifacts for audits and downstream handoff.

## Targets (day/week/month operating cadence)
- **Day:** Validate new upstream signals, execute deterministic run, and hand off outputs for active decisions.
- **Week:** Review KPI focus (`service harm`, `procedural violations`, `decision drift`), failure trends, and approval/retry performance.
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
- **Produces:** `PublicService Failure Root-Cause Miner normalized artifacts`, `execution scorecard`, `risk posture`
- **Consumes:** `protocol checks`, `service queues`, `compliance flags`, `claims`, `evidence`, `confidence traces`
- **Downstream Hint:** Route next to healthcare-and-public-services:general-capability consumers with approval-gate context
