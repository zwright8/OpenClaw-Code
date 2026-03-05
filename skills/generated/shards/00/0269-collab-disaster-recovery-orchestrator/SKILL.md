---
name: u0269-collab-disaster-recovery-orchestrator
description: Run the Collab Disaster Recovery Orchestrator capability for Collaboration and Negotiation with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Collab Disaster Recovery Orchestrator

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `269` |
| Domain | `Collaboration and Negotiation` |
| Runtime archetype | `general-capability` |
| Core method | `failover and restoration sequencing` |
| Primary artifact | `recovery mission plans` |
| Routing tag | `collaboration-and-negotiation:general-capability` |
| Feature flag | `skill_0269_collab-disaster-recovery-orchest` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because multi-agent systems underperform without explicit conflict resolution. This specific skill improves recovery speed after severe outages.

## Trigger Checklist
- [ ] The task explicitly needs Collab Disaster Recovery Orchestrator (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| proposals | signal | yes | upstream/operator |
| contention signals | signal | yes | upstream/operator |
| negotiated outcomes | signal | yes | upstream/operator |
| claims | signal | yes | upstream/operator |
| evidence | signal | yes | upstream/operator |
| confidence traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| recovery mission plans | structured-artifact | yes | downstream orchestrator |
| recovery mission plans-scorecard | scorecard | yes | operator / reviewer |
| recovery mission plans-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Collab Disaster Recovery Orchestrator`, including at least three measurable KPIs tied to deadlocks and degraded trust.
2. Design and version the input/output contract for proposals, contention signals, and negotiated outcomes, then add schema validation and failure-mode handling.
3. Implement the core capability using failover and restoration sequencing, and produce recovery mission plans with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover deadlocks and degraded trust, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Collab Disaster Recovery Orchestrator.

### Execution
- Execute failover and restoration sequencing deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Collab Disaster Recovery Orchestrator as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 70):** release artifacts after validation pass and route to `collaboration-and-negotiation:general-capability`.
- **Review posture (score >= 50 or risk >= 37):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 70):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Collab Disaster Recovery Orchestrator`, including at least three measurable KPIs tied to deadlocks and degraded trust.
- **Contract:** Design and version the input/output contract for proposals, contention signals, and negotiated outcomes, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using failover and restoration sequencing, and produce recovery mission plans with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover deadlocks and degraded trust, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.29, execution=0.21, safety=0.32, impact=0.19`
- Posture thresholds:
  - `ready`: score >= 70
  - `review`: score >= 50
  - `review_risk`: risk >= 37
  - `critical_risk`: risk >= 70
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

## External Tool Stack Recommendation
| Field | Value |
|---|---|
| Recommendation class | `tool-primary` |
| Migration priority | `P0` |
| External auth required | `yes` |
| API key likely required | `no` |
| Rationale | Deterministic infrastructure and system primitives outperform model-only execution for reliability and auditability. |

| Service | Why in stack | Auth mode | Auth required | API key likely |
|---|---|---|---|---|
| Temporal/Prefect/Airflow | workflow state + retries + durable scheduling | account/session credentials | yes | no |
| Argo Workflows/Kubernetes Jobs | execution coordination and rollbacks | account/session credentials | yes | no |
| Redis/Kafka queue | decoupled task transport and backpressure | account/session credentials | yes | no |

## External Integration Migration Checklist
- Provision service credentials and validate non-expired auth before first run.
- Wire service outputs into validation/handoff artifacts.
- Enable credential reuse; prompt user only on missing/invalid/expired credentials.

## Credential Reuse Policy
- Reuse previously provided credentials by default; do not ask for new credentials when a valid credential/session already exists.
- Before prompting, check environment/session secret stores and run lightweight auth validation.
- Ask the user for credentials only if they are missing, invalid, expired, or explicitly revoked/rotated.

## Practical Usage Examples
1. Incident recovery in Collaboration and Negotiation: ingest noisy signals, execute failover and restoration sequencing, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Collab Disaster Recovery Orchestrator against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for collaboration-and-negotiation:general-capability, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `recovery mission plans`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `proposals`, `contention signals`, `negotiated outcomes`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `collaboration-and-negotiation:general-capability` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- Trigger alerts on repeated critical posture or validation regression spikes.
- KPI focus: `deadlocks`, `degraded trust`, `decision drift`
- Primary outcome metric: `deadlocks`
- Secondary metrics: `degraded trust`, `decision drift`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
