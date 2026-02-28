---
name: u0499-research-knowledge-graph-linker
description: Build and operate the "Research Knowledge Graph Linker" capability for Scientific Research Systems. Trigger when this exact capability is needed in mission execution.
---

# Research Knowledge Graph Linker

## Why This Skill Exists
We need this skill because research throughput degrades without reproducibility and prioritization. This specific skill connects fragmented facts into reusable structures.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Research Knowledge Graph Linker`, including at least three measurable KPIs tied to non-reproducible results and wasted cycles.
2. Design and version the input/output contract for hypotheses, experiments, and replication evidence, then add schema validation and failure-mode handling.
3. Implement the core capability using entity and relation linking, and produce linked knowledge entities with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover non-reproducible results and wasted cycles, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Metadata
- **Skill ID:** `499`
- **Skill Name:** `u0499-research-knowledge-graph-linker`
- **Domain:** `Scientific Research Systems`
- **Domain Slug:** `scientific-research-systems`
- **Archetype:** `general-capability`
- **Core Method:** `entity and relation linking`
- **Primary Artifact:** `linked knowledge entities`
- **Routing Tag:** `scientific-research-systems:general-capability`
- **Feature Flag:** `skill_0499_research-knowledge-graph-linker`
- **Release Cycles:** `2`

## Allowed Tools
- `read`, `write`, `edit` for contract maintenance, runbook updates, and handoff documentation.
- `exec`, `process` for deterministic execution, validation suites, and regression checks.
- `web_search`, `web_fetch` only when fresh external evidence is required for claims/evidence inputs.
- Use messaging or publishing tools only after policy approval gates are satisfied.

## Inputs (formatted)
| name | type | required | source |
|---|---|---|---|
| hypotheses | signal | true | upstream |
| experiments | signal | true | upstream |
| replication evidence | signal | true | upstream |
| claims | signal | true | upstream |
| evidence | signal | true | upstream |
| confidence traces | signal | true | upstream |

## Outputs (formatted)
| name | type | guaranteed | consumer |
|---|---|---|---|
| linked_knowledge_entities_report | structured-report | true | orchestrator |
| linked_knowledge_entities_scorecard | scorecard | true | operator |

## Guidelines
1. Validate required inputs before execution and reject non-conforming payloads early.
2. Run `entity and relation linking` with deterministic settings and trace capture enabled.
3. Produce `linked knowledge entities` outputs in machine-readable form for orchestrator/operator use.
4. Keep routing aligned with `scientific-research-systems:general-capability` and include approval context.
5. Tune thresholds incrementally based on observed KPI drift and incident learnings.

## Musts
- Enforce approval gates: `policy-constraint-check`, `human-approval-router`.
- Apply retry policy: maxAttempts=`4`, baseDelayMs=`1200`, backoff=`exponential`.
- Run validation suites before release: `unit`, `integration`, `simulation`, `regression-baseline`.
- Fail closed when validation gates fail and execute rollback strategy `rollback-to-last-stable-baseline`.
- Preserve reproducible evidence artifacts for audits and downstream handoff.

## Targets (day/week/month operating cadence)
- **Day:** Validate new upstream signals, execute deterministic run, and hand off outputs for active decisions.
- **Week:** Review KPI focus (`non-reproducible results`, `wasted cycles`, `decision drift`), failure trends, and approval/retry performance.
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
- **Produces:** `Research Knowledge Graph Linker normalized artifacts`, `execution scorecard`, `risk posture`
- **Consumes:** `hypotheses`, `experiments`, `replication evidence`, `claims`, `evidence`, `confidence traces`
- **Downstream Hint:** Route next to scientific-research-systems:general-capability consumers with approval-gate context
