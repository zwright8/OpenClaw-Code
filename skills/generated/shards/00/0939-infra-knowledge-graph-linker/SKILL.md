---
name: u0939-infra-knowledge-graph-linker
description: Run the Infra Knowledge Graph Linker capability for Infrastructure and Sustainability with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Infra Knowledge Graph Linker

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `939` |
| Domain | `Infrastructure and Sustainability` |
| Runtime archetype | `general-capability` |
| Core method | `entity and relation linking` |
| Primary artifact | `linked knowledge entities` |
| Routing tag | `infrastructure-and-sustainability:general-capability` |
| Feature flag | `skill_0939_infra-knowledge-graph-linker` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because long-term scale depends on resilient and sustainable infrastructure choices. This specific skill connects fragmented facts into reusable structures.

## Trigger Checklist
- [ ] The task explicitly needs Infra Knowledge Graph Linker (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| capacity forecasts | signal | yes | upstream/operator |
| energy usage | signal | yes | upstream/operator |
| sustainability metrics | signal | yes | upstream/operator |
| claims | signal | yes | upstream/operator |
| evidence | signal | yes | upstream/operator |
| confidence traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| linked knowledge entities | structured-artifact | yes | downstream orchestrator |
| linked knowledge entities-scorecard | scorecard | yes | operator / reviewer |
| linked knowledge entities-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Infra Knowledge Graph Linker`, including at least three measurable KPIs tied to capacity collapse and environmental debt.
2. Design and version the input/output contract for capacity forecasts, energy usage, and sustainability metrics, then add schema validation and failure-mode handling.
3. Implement the core capability using entity and relation linking, and produce linked knowledge entities with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover capacity collapse and environmental debt, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Infra Knowledge Graph Linker.

### Execution
- Execute entity and relation linking deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Infra Knowledge Graph Linker as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 77):** release artifacts after validation pass and route to `infrastructure-and-sustainability:general-capability`.
- **Review posture (score >= 54 or risk >= 48):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 82):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Infra Knowledge Graph Linker`, including at least three measurable KPIs tied to capacity collapse and environmental debt.
- **Contract:** Design and version the input/output contract for capacity forecasts, energy usage, and sustainability metrics, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using entity and relation linking, and produce linked knowledge entities with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover capacity collapse and environmental debt, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.12, execution=0.26, safety=0.26, impact=0.36`
- Posture thresholds:
  - `ready`: score >= 77
  - `review`: score >= 54
  - `review_risk`: risk >= 48
  - `critical_risk`: risk >= 82
- Retry policy: max attempts `4`, base delay `1200ms`, backoff `exponential`.
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
1. Incident recovery in Infrastructure and Sustainability: ingest noisy signals, execute entity and relation linking, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Infra Knowledge Graph Linker against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for infrastructure-and-sustainability:general-capability, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `linked knowledge entities`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `capacity forecasts`, `energy usage`, `sustainability metrics`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `infrastructure-and-sustainability:general-capability` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- Trigger alerts on repeated critical posture or validation regression spikes.
- KPI focus: `capacity collapse`, `environmental debt`, `decision drift`
- Primary outcome metric: `capacity collapse`
- Secondary metrics: `environmental debt`, `decision drift`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
