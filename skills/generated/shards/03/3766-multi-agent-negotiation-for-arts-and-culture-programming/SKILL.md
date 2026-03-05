---
name: u03766-multi-agent-negotiation-for-arts-and-culture-programming
description: Run the Multi-Agent Negotiation for arts and culture programming capability for arts and culture programming with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Multi-Agent Negotiation for arts and culture programming

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `3766` |
| Domain | `arts and culture programming` |
| Runtime archetype | `negotiation-engine` |
| Core method | `multi-agent negotiation` |
| Primary artifact | `multi-agent-negotiation-artifact-arts-and-culture-programming` |
| Routing tag | `arts-and-culture-programming:negotiation-engine` |
| Feature flag | `skill_03766_multi-agent-negotiation` |
| Release cycles | `2` |

## Why This Skill Exists
Use multi-agent negotiation in arts and culture programming with emphasis on evidence quality, falsifiability, and calibration.

## Trigger Checklist
- [ ] The task explicitly needs Multi-Agent Negotiation for arts and culture programming (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| claims | signal | yes | upstream/operator |
| evidence | signal | yes | upstream/operator |
| confidence traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| multi-agent-negotiation-artifact-arts-and-culture-programming | structured-artifact | yes | downstream orchestrator |
| multi-agent-negotiation-artifact-arts-and-culture-programming-scorecard | scorecard | yes | operator / reviewer |
| multi-agent-negotiation-artifact-arts-and-culture-programming-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define measurable outcomes for Multi-Agent Negotiation for arts and culture programming, including baseline and target metrics for arts and culture programming.
2. Specify structured inputs/outputs for multi-agent negotiation and validate schema contract edge cases.
3. Implement the core multi-agent negotiation logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Multi-Agent Negotiation for arts and culture programming under maximally truth-seeking conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
### Preflight
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

### Execution
- Execute multi-agent negotiation workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

### Recovery
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

### Handoff
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Operator Use Cases
- Run Multi-Agent Negotiation for arts and culture programming as a repeatable production workflow for humans and agents.
- Use Multi-Agent Negotiation for arts and culture programming to accelerate decisions while preserving safety, quality, and auditability.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| quality | Require unit and integration validations before promoting Multi-Agent Negotiation for arts and culture programming. | run-validation:unit+integration+simulation+regression-baseline |
| reliability | Trigger rollback on critical posture or repeated failures. | rollback:rollback-to-last-stable-baseline |
| compliance | Require policy and approval gates prior to autonomous deployment. | approval-gates:policy-constraint-check+evidence-review |
| cost | Respect bounded resource pressure and execution budget during scaling. | budget-guard:resource-pressure-cap |

## Posture Playbook
- **Ready posture (score >= 74):** release artifacts after validation pass and route to `arts-and-culture-programming:negotiation-engine`.
- **Review posture (score >= 54 or risk >= 62):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 81):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define measurable outcomes for Multi-Agent Negotiation for arts and culture programming, including baseline and target metrics for arts and culture programming.
- **Contract:** Specify structured inputs/outputs for multi-agent negotiation and validate schema contract edge cases.
- **Core:** Implement the core multi-agent negotiation logic with deterministic scoring and reproducible execution traces.
- **Orchestration:** Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
- **Validation:** Run unit, integration, simulation, and regression suites for Multi-Agent Negotiation for arts and culture programming under maximally truth-seeking conditions.
- **Rollout:** Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.45, execution=0.20, safety=0.20, impact=0.15`
- Posture thresholds:
  - `ready`: score >= 74
  - `review`: score >= 54
  - `review_risk`: risk >= 62
  - `critical_risk`: risk >= 81
- Retry policy: max attempts `4`, base delay `750ms`, backoff `exponential`.
- Approval gates: `policy-constraint-check`, `evidence-review`.

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
| Maturity tier | `advanced` |
| Autopilot ready | `yes` |
| Parallelism | `3` |
| Max cycle minutes | `20` |
| Required approvals | `policy-constraint-check`, `evidence-review` |

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
1. Incident recovery in arts and culture programming: ingest noisy signals, execute multi-agent negotiation, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Multi-Agent Negotiation for arts and culture programming against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for arts-and-culture-programming:negotiation-engine, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `multi-agent-negotiation-artifact-arts-and-culture-programming`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `arts-and-culture-programming:negotiation-engine` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.7% successful runs per 7-day window
- Error budget: <=0.3% critical failures per 7-day window
- Alert triggers:
- critical posture exceeds baseline trend
- validation regression crosses threshold
- hardening or approval bottlenecks persist
- KPI focus: `accuracy lift`, `contradiction reduction`, `evidence coverage in arts and culture programming`
- Primary outcome metric: `accuracy lift`
- Secondary metrics: `contradiction reduction`, `evidence coverage in arts and culture programming`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
