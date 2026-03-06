---
name: u0548-engineering-incident-playbook-synthesizer
description: Run the Engineering Incident Playbook Synthesizer capability for Software Engineering Automation with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Engineering Incident Playbook Synthesizer

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `548` |
| Domain | `Software Engineering Automation` |
| Runtime archetype | `communication-engine` |
| Core method | `pattern-to-playbook synthesis` |
| Primary artifact | `incident playbooks` |
| Routing tag | `software-engineering-automation:communication-engine` |
| Feature flag | `skill_0548_engineering-incident-playbook-sy` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because delivery speed must increase without sacrificing correctness. This specific skill creates repeatable response procedures from incident history.

## Trigger Checklist
- [ ] The task explicitly needs Engineering Incident Playbook Synthesizer (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| code changes | signal | yes | upstream/operator |
| tests | signal | yes | upstream/operator |
| incidents | signal | yes | upstream/operator |
| rollout data | signal | yes | upstream/operator |
| claims | signal | yes | upstream/operator |
| evidence | signal | yes | upstream/operator |
| confidence traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| incident playbooks | structured-artifact | yes | downstream orchestrator |
| incident playbooks-scorecard | scorecard | yes | operator / reviewer |
| incident playbooks-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Engineering Incident Playbook Synthesizer`, including at least three measurable KPIs tied to regressions and brittle release pipelines.
2. Design and version the input/output contract for code changes, tests, incidents, and rollout data, then add schema validation and failure-mode handling.
3. Implement the core capability using pattern-to-playbook synthesis, and produce incident playbooks with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover regressions and brittle release pipelines, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Engineering Incident Playbook Synthesizer.

### Execution
- Execute pattern-to-playbook synthesis deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Engineering Incident Playbook Synthesizer as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 77):** release artifacts after validation pass and route to `software-engineering-automation:communication-engine`.
- **Review posture (score >= 49 or risk >= 44):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 63):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Engineering Incident Playbook Synthesizer`, including at least three measurable KPIs tied to regressions and brittle release pipelines.
- **Contract:** Design and version the input/output contract for code changes, tests, incidents, and rollout data, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using pattern-to-playbook synthesis, and produce incident playbooks with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover regressions and brittle release pipelines, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.17, execution=0.38, safety=0.28, impact=0.17`
- Posture thresholds:
  - `ready`: score >= 77
  - `review`: score >= 49
  - `review_risk`: risk >= 44
  - `critical_risk`: risk >= 63
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
1. `Temporal/Prefect/Airflow` -> auth preflight, execute read+write/orchestrate call(s), normalize output, and attach trace to `incident playbooks`.
2. `Argo Workflows/Kubernetes Jobs` -> auth preflight, execute read+write/orchestrate call(s), normalize output, and attach trace to `incident playbooks`.
3. `Redis/Kafka queue` -> auth preflight, execute read+write/orchestrate call(s), normalize output, and attach trace to `incident playbooks`.
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
1. Incident recovery in Software Engineering Automation: ingest noisy signals, execute pattern-to-playbook synthesis, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Engineering Incident Playbook Synthesizer against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for software-engineering-automation:communication-engine, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `incident playbooks`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `code changes`, `tests`, `incidents`, `rollout data`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `software-engineering-automation:communication-engine` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- Trigger alerts on repeated critical posture or validation regression spikes.
- KPI focus: `regressions`, `brittle release pipelines`, `decision drift`
- Primary outcome metric: `regressions`
- Secondary metrics: `brittle release pipelines`, `decision drift`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
