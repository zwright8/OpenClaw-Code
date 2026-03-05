---
name: u03870-conflict-resolution-coaching-for-sales-and-client-success
description: Run the Conflict Resolution Coaching for sales and client success capability for sales and client success with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Conflict Resolution Coaching for sales and client success

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `3870` |
| Domain | `sales and client success` |
| Runtime archetype | `coaching-engine` |
| Core method | `conflict resolution coaching` |
| Primary artifact | `conflict-resolution-coaching-artifact-sales-and-client-success` |
| Routing tag | `sales-and-client-success:coaching-engine` |
| Feature flag | `skill_03870_conflict-resolution-coaching` |
| Release cycles | `2` |

## Why This Skill Exists
Use conflict resolution coaching in sales and client success with emphasis on best-in-class standards, precision, and repeatable excellence.

## Trigger Checklist
- [ ] The task explicitly needs Conflict Resolution Coaching for sales and client success (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| quality standards | signal | yes | upstream/operator |
| skill rubrics | signal | yes | upstream/operator |
| performance metrics | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| conflict-resolution-coaching-artifact-sales-and-client-success | structured-artifact | yes | downstream orchestrator |
| conflict-resolution-coaching-artifact-sales-and-client-success-scorecard | scorecard | yes | operator / reviewer |
| conflict-resolution-coaching-artifact-sales-and-client-success-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define measurable outcomes for Conflict Resolution Coaching for sales and client success, including baseline and target metrics for sales and client success.
2. Specify structured inputs/outputs for conflict resolution coaching and validate schema contract edge cases.
3. Implement the core conflict resolution coaching logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Conflict Resolution Coaching for sales and client success under professional mastery conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
### Preflight
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

### Execution
- Execute conflict resolution coaching workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

### Recovery
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

### Handoff
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Operator Use Cases
- Run Conflict Resolution Coaching for sales and client success as a repeatable production workflow for humans and agents.
- Use Conflict Resolution Coaching for sales and client success to accelerate decisions while preserving safety, quality, and auditability.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| quality | Require unit and integration validations before promoting Conflict Resolution Coaching for sales and client success. | run-validation:unit+integration+simulation+regression-baseline |
| reliability | Trigger rollback on critical posture or repeated failures. | rollback:rollback-to-last-stable-baseline |
| cost | Respect bounded resource pressure and execution budget during scaling. | budget-guard:resource-pressure-cap |

## Posture Playbook
- **Ready posture (score >= 74):** release artifacts after validation pass and route to `sales-and-client-success:coaching-engine`.
- **Review posture (score >= 54 or risk >= 62):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 81):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define measurable outcomes for Conflict Resolution Coaching for sales and client success, including baseline and target metrics for sales and client success.
- **Contract:** Specify structured inputs/outputs for conflict resolution coaching and validate schema contract edge cases.
- **Core:** Implement the core conflict resolution coaching logic with deterministic scoring and reproducible execution traces.
- **Orchestration:** Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
- **Validation:** Run unit, integration, simulation, and regression suites for Conflict Resolution Coaching for sales and client success under professional mastery conditions.
- **Rollout:** Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.30, execution=0.35, safety=0.20, impact=0.15`
- Posture thresholds:
  - `ready`: score >= 74
  - `review`: score >= 54
  - `review_risk`: risk >= 62
  - `critical_risk`: risk >= 81
- Retry policy: max attempts `4`, base delay `750ms`, backoff `exponential`.
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
| Maturity tier | `foundation` |
| Autopilot ready | `yes` |
| Parallelism | `4` |
| Max cycle minutes | `25` |
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
1. Incident recovery in sales and client success: ingest noisy signals, execute conflict resolution coaching, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Conflict Resolution Coaching for sales and client success against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for sales-and-client-success:coaching-engine, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `conflict-resolution-coaching-artifact-sales-and-client-success`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `quality standards`, `skill rubrics`, `performance metrics`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `sales-and-client-success:coaching-engine` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- critical posture exceeds baseline trend
- validation regression crosses threshold
- hardening or approval bottlenecks persist
- KPI focus: `quality score`, `consistency index`, `mastery progress in sales and client success`
- Primary outcome metric: `quality score`
- Secondary metrics: `consistency index`, `mastery progress in sales and client success`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
