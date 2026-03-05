---
name: u06532-kpi-dashboard-publishing-for-research-and-development-labs
description: Run the KPI Dashboard Publishing for research and development labs capability for research and development labs with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# KPI Dashboard Publishing for research and development labs

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `6532` |
| Domain | `research and development labs` |
| Runtime archetype | `reporting-engine` |
| Core method | `kpi dashboard publishing` |
| Primary artifact | `kpi-dashboard-publishing-artifact-research-and-development-labs` |
| Routing tag | `research-and-development-labs:reporting-engine` |
| Feature flag | `skill_06532_kpi-dashboard-publishing` |
| Release cycles | `2` |

## Why This Skill Exists
Use kpi dashboard publishing in research and development labs with emphasis on safety, dignity, equity, and long-term societal benefit.

## Trigger Checklist
- [ ] The task explicitly needs KPI Dashboard Publishing for research and development labs (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| stakeholders | signal | yes | upstream/operator |
| harm signals | signal | yes | upstream/operator |
| benefit pathways | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| kpi-dashboard-publishing-artifact-research-and-development-labs | structured-artifact | yes | downstream orchestrator |
| kpi-dashboard-publishing-artifact-research-and-development-labs-scorecard | scorecard | yes | operator / reviewer |
| kpi-dashboard-publishing-artifact-research-and-development-labs-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define measurable outcomes for KPI Dashboard Publishing for research and development labs, including baseline and target metrics for research and development labs.
2. Specify structured inputs/outputs for kpi dashboard publishing and validate schema contract edge cases.
3. Implement the core kpi dashboard publishing logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for KPI Dashboard Publishing for research and development labs under pro-humanity impact conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
### Preflight
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

### Execution
- Execute kpi dashboard publishing workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

### Recovery
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

### Handoff
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Operator Use Cases
- Run KPI Dashboard Publishing for research and development labs as a repeatable production workflow for humans and agents.
- Use KPI Dashboard Publishing for research and development labs to accelerate decisions while preserving safety, quality, and auditability.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| quality | Require unit and integration validations before promoting KPI Dashboard Publishing for research and development labs. | run-validation:unit+integration+simulation+regression-baseline |
| reliability | Trigger rollback on critical posture or repeated failures. | rollback:rollback-to-last-stable-baseline |
| compliance | Require policy and approval gates prior to autonomous deployment. | approval-gates:policy-constraint-check+human-impact-review |
| cost | Respect bounded resource pressure and execution budget during scaling. | budget-guard:resource-pressure-cap |

## Posture Playbook
- **Ready posture (score >= 74):** release artifacts after validation pass and route to `research-and-development-labs:reporting-engine`.
- **Review posture (score >= 54 or risk >= 62):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 81):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define measurable outcomes for KPI Dashboard Publishing for research and development labs, including baseline and target metrics for research and development labs.
- **Contract:** Specify structured inputs/outputs for kpi dashboard publishing and validate schema contract edge cases.
- **Core:** Implement the core kpi dashboard publishing logic with deterministic scoring and reproducible execution traces.
- **Orchestration:** Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
- **Validation:** Run unit, integration, simulation, and regression suites for KPI Dashboard Publishing for research and development labs under pro-humanity impact conditions.
- **Rollout:** Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.25, execution=0.15, safety=0.40, impact=0.20`
- Posture thresholds:
  - `ready`: score >= 74
  - `review`: score >= 54
  - `review_risk`: risk >= 62
  - `critical_risk`: risk >= 81
- Retry policy: max attempts `4`, base delay `750ms`, backoff `exponential`.
- Approval gates: `policy-constraint-check`, `human-impact-review`.

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
| Required approvals | `policy-constraint-check`, `human-impact-review` |

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
1. Incident recovery in research and development labs: ingest noisy signals, execute kpi dashboard publishing, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run KPI Dashboard Publishing for research and development labs against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for research-and-development-labs:reporting-engine, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `kpi-dashboard-publishing-artifact-research-and-development-labs`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `stakeholders`, `harm signals`, `benefit pathways`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `research-and-development-labs:reporting-engine` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.7% successful runs per 7-day window
- Error budget: <=0.3% critical failures per 7-day window
- Alert triggers:
- critical posture exceeds baseline trend
- validation regression crosses threshold
- hardening or approval bottlenecks persist
- KPI focus: `harm reduction`, `equity improvement`, `human benefit in research and development labs`
- Primary outcome metric: `harm reduction`
- Secondary metrics: `equity improvement`, `human benefit in research and development labs`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
