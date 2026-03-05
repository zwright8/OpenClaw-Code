---
name: u0621-security-plan-quality-evaluator
description: Run the Security Plan Quality Evaluator capability for Security and Privacy with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Security Plan Quality Evaluator

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `621` |
| Domain | `Security and Privacy` |
| Runtime archetype | `general-capability` |
| Core method | `multi-criteria plan scoring` |
| Primary artifact | `plan quality scorecards` |
| Routing tag | `security-and-privacy:general-capability` |
| Feature flag | `skill_0621_security-plan-quality-evaluator` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because production autonomy must default to least privilege and strong privacy. This specific skill quantifies whether plans are complete, safe, and feasible.

## Trigger Checklist
- [ ] The task explicitly needs Security Plan Quality Evaluator (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| permissions | signal | yes | upstream/operator |
| sensitive data flows | signal | yes | upstream/operator |
| threat events | signal | yes | upstream/operator |
| claims | signal | yes | upstream/operator |
| evidence | signal | yes | upstream/operator |
| confidence traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| plan quality scorecards | structured-artifact | yes | downstream orchestrator |
| plan quality scorecards-scorecard | scorecard | yes | operator / reviewer |
| plan quality scorecards-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Security Plan Quality Evaluator`, including at least three measurable KPIs tied to breach, exfiltration, and over-privileged actions.
2. Design and version the input/output contract for permissions, sensitive data flows, and threat events, then add schema validation and failure-mode handling.
3. Implement the core capability using multi-criteria plan scoring, and produce plan quality scorecards with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover breach, exfiltration, and over-privileged actions, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Security Plan Quality Evaluator.

### Execution
- Execute multi-criteria plan scoring deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Security Plan Quality Evaluator as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 70):** release artifacts after validation pass and route to `security-and-privacy:general-capability`.
- **Review posture (score >= 60 or risk >= 52):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 86):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Security Plan Quality Evaluator`, including at least three measurable KPIs tied to breach, exfiltration, and over-privileged actions.
- **Contract:** Design and version the input/output contract for permissions, sensitive data flows, and threat events, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using multi-criteria plan scoring, and produce plan quality scorecards with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover breach, exfiltration, and over-privileged actions, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.29, execution=0.34, safety=0.11, impact=0.26`
- Posture thresholds:
  - `ready`: score >= 70
  - `review`: score >= 60
  - `review_risk`: risk >= 52
  - `critical_risk`: risk >= 86
- Retry policy: max attempts `4`, base delay `750ms`, backoff `exponential`.
- Approval gates: `policy-constraint-check`, `human-approval-router`, `security-review`.

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
| Required approvals | `policy-constraint-check`, `human-approval-router`, `security-review` |

## Acceptance Checklist
- [ ] Schema, determinism, policy, and reliability gates all pass.
- [ ] Output artifact bundle includes scorecard, risks, and next actions.
- [ ] Handoff owner confirms artifact usability without additional clarification.
- [ ] Telemetry and trace references are attached for auditability.

## External Tool Stack Recommendation
| Field | Value |
|---|---|
| Recommendation class | `hybrid` |
| Migration priority | `P1` |
| External auth required | `yes` |
| API key likely required | `no` |
| Rationale | Use external systems for persistence/enforcement/math and frontier models for synthesis and language-heavy reasoning. |

| Service | Why in stack | Auth mode | Auth required | API key likely |
|---|---|---|---|---|
| OR-Tools/Pyomo | constraint optimization and budget allocation | none/local runtime | no | no |
| Pandas/Polars | deterministic metric computations | none/local runtime | no | no |
| Great Expectations | data quality assertions before scoring | none/local runtime | no | no |
| Audit log + immutable storage | compliance-grade evidence retention | account/session credentials | yes | no |

## External Integration Migration Checklist
- Provision service credentials and validate non-expired auth before first run.
- Wire service outputs into validation/handoff artifacts.
- Enable credential reuse; prompt user only on missing/invalid/expired credentials.

## Credential Reuse Policy
- Reuse previously provided credentials by default; do not ask for new credentials when a valid credential/session already exists.
- Before prompting, check environment/session secret stores and run lightweight auth validation.
- Ask the user for credentials only if they are missing, invalid, expired, or explicitly revoked/rotated.

## Practical Usage Examples
1. Incident recovery in Security and Privacy: ingest noisy signals, execute multi-criteria plan scoring, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Security Plan Quality Evaluator against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for security-and-privacy:general-capability, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `plan quality scorecards`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `permissions`, `sensitive data flows`, `threat events`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `security-and-privacy:general-capability` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- Trigger alerts on repeated critical posture or validation regression spikes.
- KPI focus: `breach`, `exfiltration`, `over-privileged actions`
- Primary outcome metric: `breach`
- Secondary metrics: `exfiltration`, `over-privileged actions`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
