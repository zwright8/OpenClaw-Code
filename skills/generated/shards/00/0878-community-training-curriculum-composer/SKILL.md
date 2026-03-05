---
name: u0878-community-training-curriculum-composer
description: Run the Community Training Curriculum Composer capability for Community Engagement and Feedback with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Community Training Curriculum Composer

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `878` |
| Domain | `Community Engagement and Feedback` |
| Runtime archetype | `general-capability` |
| Core method | `sequenced learning path design` |
| Primary artifact | `role-specific curricula` |
| Routing tag | `community-engagement-and-feedback:general-capability` |
| Feature flag | `skill_0878_community-training-curriculum-co` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because real-world feedback loops are necessary for continuous alignment. This specific skill converts capability gaps into actionable upskilling programs.

## Trigger Checklist
- [ ] The task explicitly needs Community Training Curriculum Composer (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| feedback channels | signal | yes | upstream/operator |
| sentiment | signal | yes | upstream/operator |
| urgency | signal | yes | upstream/operator |
| follow-ups | signal | yes | upstream/operator |
| claims | signal | yes | upstream/operator |
| evidence | signal | yes | upstream/operator |
| confidence traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| role-specific curricula | structured-artifact | yes | downstream orchestrator |
| role-specific curricula-scorecard | scorecard | yes | operator / reviewer |
| role-specific curricula-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Community Training Curriculum Composer`, including at least three measurable KPIs tied to community trust loss and unaddressed concerns.
2. Design and version the input/output contract for feedback channels, sentiment, urgency, and follow-ups, then add schema validation and failure-mode handling.
3. Implement the core capability using sequenced learning path design, and produce role-specific curricula with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover community trust loss and unaddressed concerns, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Community Training Curriculum Composer.

### Execution
- Execute sequenced learning path design deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Community Training Curriculum Composer as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 77):** release artifacts after validation pass and route to `community-engagement-and-feedback:general-capability`.
- **Review posture (score >= 60 or risk >= 52):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 80):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Community Training Curriculum Composer`, including at least three measurable KPIs tied to community trust loss and unaddressed concerns.
- **Contract:** Design and version the input/output contract for feedback channels, sentiment, urgency, and follow-ups, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using sequenced learning path design, and produce role-specific curricula with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover community trust loss and unaddressed concerns, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.22, execution=0.25, safety=0.26, impact=0.27`
- Posture thresholds:
  - `ready`: score >= 77
  - `review`: score >= 60
  - `review_risk`: risk >= 52
  - `critical_risk`: risk >= 80
- Retry policy: max attempts `3`, base delay `1050ms`, backoff `exponential`.
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
1. Incident recovery in Community Engagement and Feedback: ingest noisy signals, execute sequenced learning path design, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Community Training Curriculum Composer against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for community-engagement-and-feedback:general-capability, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `role-specific curricula`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `feedback channels`, `sentiment`, `urgency`, `follow-ups`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `community-engagement-and-feedback:general-capability` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- Trigger alerts on repeated critical posture or validation regression spikes.
- KPI focus: `community trust loss`, `unaddressed concerns`, `decision drift`
- Primary outcome metric: `community trust loss`
- Secondary metrics: `unaddressed concerns`, `decision drift`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
