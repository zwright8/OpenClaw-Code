---
name: u0434-publicservice-equity-impact-scorer
description: Run the PublicService Equity Impact Scorer capability for Healthcare and Public Services with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# PublicService Equity Impact Scorer

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `434` |
| Domain | `Healthcare and Public Services` |
| Runtime archetype | `general-capability` |
| Core method | `group-level impact scoring` |
| Primary artifact | `equity impact profiles` |
| Routing tag | `healthcare-and-public-services:general-capability` |
| Feature flag | `skill_0434_publicservice-equity-impact-scor` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because public-facing workflows require strict safety and reliability controls. This specific skill exposes uneven benefit/harm distribution before rollout.

## Trigger Checklist
- [ ] The task explicitly needs PublicService Equity Impact Scorer (not generic brainstorming).
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
| equity impact profiles | structured-artifact | yes | downstream orchestrator |
| equity impact profiles-scorecard | scorecard | yes | operator / reviewer |
| equity impact profiles-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `PublicService Equity Impact Scorer`, including at least three measurable KPIs tied to service harm and procedural violations.
2. Design and version the input/output contract for protocol checks, service queues, and compliance flags, then add schema validation and failure-mode handling.
3. Implement the core capability using group-level impact scoring, and produce equity impact profiles with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover service harm and procedural violations, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for PublicService Equity Impact Scorer.

### Execution
- Execute group-level impact scoring deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate PublicService Equity Impact Scorer as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 77):** release artifacts after validation pass and route to `healthcare-and-public-services:general-capability`.
- **Review posture (score >= 47 or risk >= 40):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 72):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `PublicService Equity Impact Scorer`, including at least three measurable KPIs tied to service harm and procedural violations.
- **Contract:** Design and version the input/output contract for protocol checks, service queues, and compliance flags, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using group-level impact scoring, and produce equity impact profiles with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover service harm and procedural violations, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.29, execution=0.32, safety=0.22, impact=0.17`
- Posture thresholds:
  - `ready`: score >= 77
  - `review`: score >= 47
  - `review_risk`: risk >= 40
  - `critical_risk`: risk >= 72
- Retry policy: max attempts `3`, base delay `1200ms`, backoff `exponential`.
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
1. Incident recovery in Healthcare and Public Services: ingest noisy signals, execute group-level impact scoring, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run PublicService Equity Impact Scorer against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for healthcare-and-public-services:general-capability, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `equity impact profiles`, scorecard, risk/confidence metadata, remediation backlog.
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
