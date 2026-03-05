---
name: u0213-oversight-task-handoff-contractor
description: Run the Oversight Task Handoff Contractor capability for Human Oversight and Operator UX with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Oversight Task Handoff Contractor

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `213` |
| Domain | `Human Oversight and Operator UX` |
| Runtime archetype | `contract-compiler` |
| Core method | `contracted payload schemas` |
| Primary artifact | `typed handoff artifacts` |
| Routing tag | `human-oversight-and-operator-ux:contract-compiler` |
| Feature flag | `skill_0213_oversight-task-handoff-contracto` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because human teams need fast, legible control when stakes are high. This specific skill standardizes handoffs between agents and humans.

## Trigger Checklist
- [ ] The task explicitly needs Oversight Task Handoff Contractor (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| approval queues | signal | yes | upstream/operator |
| operator workload | signal | yes | upstream/operator |
| intervention history | signal | yes | upstream/operator |
| claims | signal | yes | upstream/operator |
| evidence | signal | yes | upstream/operator |
| confidence traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| typed handoff artifacts | structured-artifact | yes | downstream orchestrator |
| typed handoff artifacts-scorecard | scorecard | yes | operator / reviewer |
| typed handoff artifacts-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Oversight Task Handoff Contractor`, including at least three measurable KPIs tied to slow interventions and approval bottlenecks.
2. Design and version the input/output contract for approval queues, operator workload, and intervention history, then add schema validation and failure-mode handling.
3. Implement the core capability using contracted payload schemas, and produce typed handoff artifacts with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover slow interventions and approval bottlenecks, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Oversight Task Handoff Contractor.

### Execution
- Execute contracted payload schemas deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Oversight Task Handoff Contractor as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 73):** release artifacts after validation pass and route to `human-oversight-and-operator-ux:contract-compiler`.
- **Review posture (score >= 61 or risk >= 54):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 83):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Oversight Task Handoff Contractor`, including at least three measurable KPIs tied to slow interventions and approval bottlenecks.
- **Contract:** Design and version the input/output contract for approval queues, operator workload, and intervention history, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using contracted payload schemas, and produce typed handoff artifacts with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover slow interventions and approval bottlenecks, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.23, execution=0.27, safety=0.25, impact=0.25`
- Posture thresholds:
  - `ready`: score >= 73
  - `review`: score >= 61
  - `review_risk`: risk >= 54
  - `critical_risk`: risk >= 83
- Retry policy: max attempts `4`, base delay `1050ms`, backoff `exponential`.
- Approval gates: `policy-constraint-check`, `human-approval-router`.

## Validation Gates & Test Matrix
| Gate | Purpose | On Fail |
|---|---|---|
| schema-contract-check | Ensure required inputs and contract shape are valid. | block release |
| determinism-check | Replay identical input and compare output hash/score delta. | escalate + quarantine |
| policy-approval-check | Verify policy constraints and approval tokens. | block publish |
| reliability-check | Validate retry budget and rollback readiness. | rollback to stable baseline |

- Required validation suites: unit, integration, simulation, regression-baseline

## Failure Modes & Recovery Playbook
- `E_INPUT_SCHEMA`: required signal missing or malformed -> reject payload and request corrected input.
- `E_NON_DETERMINISM`: replay mismatch or unstable score delta -> quarantine output and escalate for human review.
- `E_POLICY_BLOCK`: approval/policy gate unsatisfied -> keep publish blocked until explicit approval is attached.
- `E_DEPENDENCY_TIMEOUT`: transient timeout -> apply retry budget; if unresolved, execute `rollback-to-last-stable-baseline` and issue incident packet.

## Human Approval & Escalation
- High-risk or policy-sensitive runs require an explicit approval token before release.
- Escalate to human reviewer when any gate fails twice or critical risk posture is reached.
- Escalation packet must include: scope, failed gate, evidence links, retry history, and recommended decision.

## Automation Envelope
| Setting | Value |
|---|---|
| Maturity tier | `standard` |
| Autopilot ready | `no` |
| Parallelism | `1` |
| Max cycle minutes | `n/a` |
| Required approvals | `policy-constraint-check`, `human-approval-router` |

## Acceptance Checklist
- [ ] Schema, determinism, policy, and reliability gates all pass.
- [ ] Output artifact bundle includes scorecard, risks, and next actions.
- [ ] Handoff owner confirms artifact usability without additional clarification.
- [ ] Telemetry and trace references are attached for auditability.

## External/API Dependency & Credential Reuse Policy
| Field | Value |
|---|---|
| External/API required by profile | `no` |
| Detection hint | No mandatory external API dependency inferred from current profile data; still verify environment/session credentials for connected runtimes. |
| Clues found | `none-detected` |

- Reuse previously provided credentials by default; do not ask for a new API key/token when a valid one already exists.
- Before prompting, check configured environment/session secret stores and run a lightweight auth validation.
- Ask the user for credentials only if they are missing, invalid, expired, or explicitly revoked/rotated.

## Practical Usage Examples
1. Incident recovery in Human Oversight and Operator UX: ingest noisy signals, execute contracted payload schemas, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Oversight Task Handoff Contractor against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for human-oversight-and-operator-ux:contract-compiler, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `typed handoff artifacts`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `approval queues`, `operator workload`, `intervention history`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `human-oversight-and-operator-ux:contract-compiler` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- Trigger alerts on repeated critical posture or validation regression spikes.
- KPI focus: `slow interventions`, `approval bottlenecks`, `decision drift`
- Primary outcome metric: `slow interventions`
- Secondary metrics: `approval bottlenecks`, `decision drift`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
