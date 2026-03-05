---
name: u0427-publicservice-a-b-rollout-governor
description: Run the PublicService A/B Rollout Governor capability for Healthcare and Public Services with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# PublicService A/B Rollout Governor

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `427` |
| Domain | `Healthcare and Public Services` |
| Runtime archetype | `general-capability` |
| Core method | `staged rollout policies` |
| Primary artifact | `safe rollout decisions` |
| Routing tag | `healthcare-and-public-services:general-capability` |
| Feature flag | `skill_0427_publicservice-a-b-rollout-govern` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because public-facing workflows require strict safety and reliability controls. This specific skill controls production risk during behavioral changes.

## Trigger Checklist
- [ ] The task explicitly needs PublicService A/B Rollout Governor (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| protocol checks | signal | yes | upstream/operator |
| service queues | signal | yes | upstream/operator |
| compliance flags | signal | yes | upstream/operator |
| claims | signal | yes | upstream/operator |
| evidence | signal | yes | upstream/operator |
| confidence traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| safe rollout decisions | structured-artifact | yes | downstream orchestrator |
| safe rollout decisions-scorecard | scorecard | yes | operator / reviewer |
| safe rollout decisions-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `PublicService A/B Rollout Governor`, including at least three measurable KPIs tied to service harm and procedural violations.
2. Design and version the input/output contract for protocol checks, service queues, and compliance flags, then add schema validation and failure-mode handling.
3. Implement the core capability using staged rollout policies, and produce safe rollout decisions with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover service harm and procedural violations, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for PublicService A/B Rollout Governor.

### Execution
- Execute staged rollout policies deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate PublicService A/B Rollout Governor as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 77):** release artifacts after validation pass and route to `healthcare-and-public-services:general-capability`.
- **Review posture (score >= 46 or risk >= 39):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 59):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `PublicService A/B Rollout Governor`, including at least three measurable KPIs tied to service harm and procedural violations.
- **Contract:** Design and version the input/output contract for protocol checks, service queues, and compliance flags, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using staged rollout policies, and produce safe rollout decisions with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover service harm and procedural violations, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.30, execution=0.15, safety=0.37, impact=0.18`
- Posture thresholds:
  - `ready`: score >= 77
  - `review`: score >= 46
  - `review_risk`: risk >= 39
  - `critical_risk`: risk >= 59
- Retry policy: max attempts `4`, base delay `900ms`, backoff `exponential`.
- Approval gates: `policy-constraint-check`, `human-approval-router`, `safety-review`.

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
| Required approvals | `policy-constraint-check`, `human-approval-router`, `safety-review` |

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
1. Incident recovery in Healthcare and Public Services: ingest noisy signals, execute staged rollout policies, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run PublicService A/B Rollout Governor against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for healthcare-and-public-services:general-capability, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `safe rollout decisions`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `protocol checks`, `service queues`, `compliance flags`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `healthcare-and-public-services:general-capability` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- Trigger alerts on repeated critical posture or validation regression spikes.
- KPI focus: `service harm`, `procedural violations`, `decision drift`
- Primary outcome metric: `service harm`
- Secondary metrics: `procedural violations`, `decision drift`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
