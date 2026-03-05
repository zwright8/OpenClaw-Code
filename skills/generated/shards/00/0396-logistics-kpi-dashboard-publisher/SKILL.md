---
name: u0396-logistics-kpi-dashboard-publisher
description: Run the Logistics KPI Dashboard Publisher capability for Resource Allocation and Logistics with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Logistics KPI Dashboard Publisher

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `396` |
| Domain | `Resource Allocation and Logistics` |
| Runtime archetype | `communication-engine` |
| Core method | `metric synthesis and publication` |
| Primary artifact | `operator KPI dashboards` |
| Routing tag | `resource-allocation-and-logistics:communication-engine` |
| Feature flag | `skill_0396_logistics-kpi-dashboard-publishe` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because impact work fails when scarce resources are not routed intelligently. This specific skill keeps mission status observable in real time.

## Trigger Checklist
- [ ] The task explicitly needs Logistics KPI Dashboard Publisher (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| capacity | signal | yes | upstream/operator |
| bottlenecks | signal | yes | upstream/operator |
| distribution plans | signal | yes | upstream/operator |
| claims | signal | yes | upstream/operator |
| evidence | signal | yes | upstream/operator |
| confidence traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| operator KPI dashboards | structured-artifact | yes | downstream orchestrator |
| operator KPI dashboards-scorecard | scorecard | yes | operator / reviewer |
| operator KPI dashboards-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Logistics KPI Dashboard Publisher`, including at least three measurable KPIs tied to supply shortfalls and fairness gaps.
2. Design and version the input/output contract for capacity, bottlenecks, and distribution plans, then add schema validation and failure-mode handling.
3. Implement the core capability using metric synthesis and publication, and produce operator KPI dashboards with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover supply shortfalls and fairness gaps, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Logistics KPI Dashboard Publisher.

### Execution
- Execute metric synthesis and publication deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Logistics KPI Dashboard Publisher as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 76):** release artifacts after validation pass and route to `resource-allocation-and-logistics:communication-engine`.
- **Review posture (score >= 43 or risk >= 44):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 70):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Logistics KPI Dashboard Publisher`, including at least three measurable KPIs tied to supply shortfalls and fairness gaps.
- **Contract:** Design and version the input/output contract for capacity, bottlenecks, and distribution plans, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using metric synthesis and publication, and produce operator KPI dashboards with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover supply shortfalls and fairness gaps, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.27, execution=0.36, safety=0.22, impact=0.15`
- Posture thresholds:
  - `ready`: score >= 76
  - `review`: score >= 43
  - `review_risk`: risk >= 44
  - `critical_risk`: risk >= 70
- Retry policy: max attempts `3`, base delay `750ms`, backoff `exponential`.
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
| Prometheus + Alertmanager | metrics ingestion, alert thresholds, and SLO burn-rate checks | account/session credentials | yes | no |
| OpenTelemetry Collector | trace/span/log normalization pipeline | account/session credentials | yes | no |
| Grafana/Metabase/Superset | deterministic dashboard publication | account/session credentials | yes | no |

## External Integration Migration Checklist
- Provision service credentials and validate non-expired auth before first run.
- Wire service outputs into validation/handoff artifacts.
- Enable credential reuse; prompt user only on missing/invalid/expired credentials.

## Credential Reuse Policy
- Reuse previously provided credentials by default; do not ask for new credentials when a valid credential/session already exists.
- Before prompting, check environment/session secret stores and run lightweight auth validation.
- Ask the user for credentials only if they are missing, invalid, expired, or explicitly revoked/rotated.

## Practical Usage Examples
1. Incident recovery in Resource Allocation and Logistics: ingest noisy signals, execute metric synthesis and publication, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Logistics KPI Dashboard Publisher against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for resource-allocation-and-logistics:communication-engine, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `operator KPI dashboards`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `capacity`, `bottlenecks`, `distribution plans`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `resource-allocation-and-logistics:communication-engine` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- Trigger alerts on repeated critical posture or validation regression spikes.
- KPI focus: `supply shortfalls`, `fairness gaps`, `decision drift`
- Primary outcome metric: `supply shortfalls`
- Secondary metrics: `fairness gaps`, `decision drift`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
