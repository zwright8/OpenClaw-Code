---
name: u0375-logistics-auto-retry-and-backoff-coordinator
description: Run the Logistics Auto-Retry and Backoff Coordinator capability for Resource Allocation and Logistics with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Logistics Auto-Retry and Backoff Coordinator

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `375` |
| Domain | `Resource Allocation and Logistics` |
| Runtime archetype | `general-capability` |
| Core method | `adaptive backoff control` |
| Primary artifact | `retry policy decisions` |
| Routing tag | `resource-allocation-and-logistics:general-capability` |
| Feature flag | `skill_0375_logistics-auto-retry-and-backoff` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because impact work fails when scarce resources are not routed intelligently. This specific skill improves success rates while preventing retry storms.

## Trigger Checklist
- [ ] The task explicitly needs Logistics Auto-Retry and Backoff Coordinator (not generic brainstorming).
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
| retry policy decisions | structured-artifact | yes | downstream orchestrator |
| retry policy decisions-scorecard | scorecard | yes | operator / reviewer |
| retry policy decisions-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Logistics Auto-Retry and Backoff Coordinator`, including at least three measurable KPIs tied to supply shortfalls and fairness gaps.
2. Design and version the input/output contract for capacity, bottlenecks, and distribution plans, then add schema validation and failure-mode handling.
3. Implement the core capability using adaptive backoff control, and produce retry policy decisions with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover supply shortfalls and fairness gaps, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Logistics Auto-Retry and Backoff Coordinator.

### Execution
- Execute adaptive backoff control deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Logistics Auto-Retry and Backoff Coordinator as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 71):** release artifacts after validation pass and route to `resource-allocation-and-logistics:general-capability`.
- **Review posture (score >= 56 or risk >= 59):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 87):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Logistics Auto-Retry and Backoff Coordinator`, including at least three measurable KPIs tied to supply shortfalls and fairness gaps.
- **Contract:** Design and version the input/output contract for capacity, bottlenecks, and distribution plans, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using adaptive backoff control, and produce retry policy decisions with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover supply shortfalls and fairness gaps, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.27, execution=0.22, safety=0.15, impact=0.36`
- Posture thresholds:
  - `ready`: score >= 71
  - `review`: score >= 56
  - `review_risk`: risk >= 59
  - `critical_risk`: risk >= 87
- Retry policy: max attempts `4`, base delay `600ms`, backoff `exponential`.
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

## Tool Inventory Highlights
| Tool | Role in execution | Call pattern | Mutating |
|---|---|---|---|
| Temporal/Prefect/Airflow | workflow state + retries + durable scheduling | read+write/orchestrate | yes |
| Argo Workflows/Kubernetes Jobs | execution coordination and rollbacks | read+write/orchestrate | yes |
| Redis/Kafka queue | decoupled task transport and backpressure | read+write/orchestrate | yes |

## API Protocols & Credential Requirements
| Tool | Primary protocol(s) | Auth mode | Auth required | API key needed | Operator action |
|---|---|---|---|---|---|
| Temporal/Prefect/Airflow | gRPC, HTTPS/REST | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |
| Argo Workflows/Kubernetes Jobs | Kubernetes API (HTTPS/REST) | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |
| Redis/Kafka queue | RESP (Redis protocol) | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |

## Tool Call Implementation
- Use the following deterministic call sequence for this skill:
1. `Temporal/Prefect/Airflow` -> auth preflight, execute read+write/orchestrate call(s), normalize output, and attach trace to `retry policy decisions`.
2. `Argo Workflows/Kubernetes Jobs` -> auth preflight, execute read+write/orchestrate call(s), normalize output, and attach trace to `retry policy decisions`.
3. `Redis/Kafka queue` -> auth preflight, execute read+write/orchestrate call(s), normalize output, and attach trace to `retry policy decisions`.
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
1. Incident recovery in Resource Allocation and Logistics: ingest noisy signals, execute adaptive backoff control, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Logistics Auto-Retry and Backoff Coordinator against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for resource-allocation-and-logistics:general-capability, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `retry policy decisions`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `capacity`, `bottlenecks`, `distribution plans`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `resource-allocation-and-logistics:general-capability` consumers with approval context attached.

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
