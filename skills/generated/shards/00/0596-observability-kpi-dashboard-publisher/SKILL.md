---
name: u0596-observability-kpi-dashboard-publisher
description: Run the Observability KPI Dashboard Publisher capability for Data Quality and Observability with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Observability KPI Dashboard Publisher

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `596` |
| Domain | `Data Quality and Observability` |
| Runtime archetype | `communication-engine` |
| Core method | `metric synthesis and publication` |
| Primary artifact | `operator KPI dashboards` |
| Routing tag | `data-quality-and-observability:communication-engine` |
| Feature flag | `skill_0596_observability-kpi-dashboard-publ` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because decisions are only as good as the quality and visibility of data. This specific skill keeps mission status observable in real time.

## Trigger Checklist
- [ ] The task explicitly needs Observability KPI Dashboard Publisher (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| freshness | signal | yes | upstream/operator |
| drift | signal | yes | upstream/operator |
| schema health | signal | yes | upstream/operator |
| telemetry coverage | signal | yes | upstream/operator |
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
1. Define the scope and success metrics for `Observability KPI Dashboard Publisher`, including at least three measurable KPIs tied to data drift and blind spots.
2. Design and version the input/output contract for freshness, drift, schema health, and telemetry coverage, then add schema validation and failure-mode handling.
3. Implement the core capability using metric synthesis and publication, and produce operator KPI dashboards with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover data drift and blind spots, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Observability KPI Dashboard Publisher.

### Execution
- Execute metric synthesis and publication deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Observability KPI Dashboard Publisher as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 70):** release artifacts after validation pass and route to `data-quality-and-observability:communication-engine`.
- **Review posture (score >= 52 or risk >= 53):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 77):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Observability KPI Dashboard Publisher`, including at least three measurable KPIs tied to data drift and blind spots.
- **Contract:** Design and version the input/output contract for freshness, drift, schema health, and telemetry coverage, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using metric synthesis and publication, and produce operator KPI dashboards with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover data drift and blind spots, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.22, execution=0.38, safety=0.16, impact=0.24`
- Posture thresholds:
  - `ready`: score >= 70
  - `review`: score >= 52
  - `review_risk`: risk >= 53
  - `critical_risk`: risk >= 77
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

## Tool Inventory Highlights
| Tool | Role in execution | Call pattern | Mutating |
|---|---|---|---|
| Prometheus + Alertmanager | metrics ingestion, alert thresholds, and SLO burn-rate checks | read/query | no |
| OpenTelemetry Collector | trace/span/log normalization pipeline | read+write | yes |
| Grafana/Metabase/Superset | deterministic dashboard publication | read+write/orchestrate | yes |

## API Protocols & Credential Requirements
| Tool | Primary protocol(s) | Auth mode | Auth required | API key needed | Operator action |
|---|---|---|---|---|---|
| Prometheus + Alertmanager | HTTPS/REST, PromQL | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |
| OpenTelemetry Collector | OTLP/gRPC, OTLP/HTTP | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |
| Grafana/Metabase/Superset | HTTPS/REST, SQL datasource | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |

## Tool Call Implementation
- Use the following deterministic call sequence for this skill:
1. `Prometheus + Alertmanager` -> auth preflight, execute read/query call(s), normalize output, and attach trace to `operator KPI dashboards`.
2. `OpenTelemetry Collector` -> auth preflight, execute read+write call(s), normalize output, and attach trace to `operator KPI dashboards`.
3. `Grafana/Metabase/Superset` -> auth preflight, execute read+write/orchestrate call(s), normalize output, and attach trace to `operator KPI dashboards`.
- After each call, validate schema + policy gates and preserve evidence in the handoff packet.
- If any required credential check fails, halt execution and request corrected auth context.

## External Integration Migration Checklist
- Provision service credentials and validate non-expired auth before first run.
- Wire service outputs into validation/handoff artifacts.
- Enable credential reuse; prompt user only on missing/invalid/expired credentials.

## Credential Reuse Policy
- Reuse previously provided credentials by default; do not ask for new credentials when a valid credential/session already exists.
- Before prompting, check environment/session secret stores and run lightweight auth validation.
- Ask the user for credentials only if they are missing, invalid, expired, or explicitly revoked/rotated.

## Practical Usage Examples
1. Incident recovery in Data Quality and Observability: ingest noisy signals, execute metric synthesis and publication, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Observability KPI Dashboard Publisher against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for data-quality-and-observability:communication-engine, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `operator KPI dashboards`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `freshness`, `drift`, `schema health`, `telemetry coverage`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `data-quality-and-observability:communication-engine` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- Trigger alerts on repeated critical posture or validation regression spikes.
- KPI focus: `data drift`, `blind spots`, `decision drift`
- Primary outcome metric: `data drift`
- Secondary metrics: `blind spots`, `decision drift`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
