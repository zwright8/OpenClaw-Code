---
name: u0728-comms-dependency-dag-planner
description: Run the Comms Dependency DAG Planner capability for Communication and Explainability with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Comms Dependency DAG Planner

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `728` |
| Domain | `Communication and Explainability` |
| Runtime archetype | `planning-router` |
| Core method | `dependency graph compilation` |
| Primary artifact | `validated workflow DAGs` |
| Routing tag | `communication-and-explainability:planning-router` |
| Feature flag | `skill_0728_comms-dependency-dag-planner` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because complex systems require explanations humans can act on quickly. This specific skill prevents sequencing errors and hidden blockers.

## Trigger Checklist
- [ ] The task explicitly needs Comms Dependency DAG Planner (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| decision factors | signal | yes | upstream/operator |
| uncertainty markers | signal | yes | upstream/operator |
| audience summaries | signal | yes | upstream/operator |
| claims | signal | yes | upstream/operator |
| evidence | signal | yes | upstream/operator |
| confidence traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| validated workflow DAGs | structured-artifact | yes | downstream orchestrator |
| validated workflow DAGs-scorecard | scorecard | yes | operator / reviewer |
| validated workflow DAGs-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Comms Dependency DAG Planner`, including at least three measurable KPIs tied to misinterpretation and trust erosion.
2. Design and version the input/output contract for decision factors, uncertainty markers, and audience summaries, then add schema validation and failure-mode handling.
3. Implement the core capability using dependency graph compilation, and produce validated workflow DAGs with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover misinterpretation and trust erosion, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Comms Dependency DAG Planner.

### Execution
- Execute dependency graph compilation deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Comms Dependency DAG Planner as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 71):** release artifacts after validation pass and route to `communication-and-explainability:planning-router`.
- **Review posture (score >= 54 or risk >= 59):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 87):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Comms Dependency DAG Planner`, including at least three measurable KPIs tied to misinterpretation and trust erosion.
- **Contract:** Design and version the input/output contract for decision factors, uncertainty markers, and audience summaries, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using dependency graph compilation, and produce validated workflow DAGs with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover misinterpretation and trust erosion, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.28, execution=0.22, safety=0.24, impact=0.26`
- Posture thresholds:
  - `ready`: score >= 71
  - `review`: score >= 54
  - `review_risk`: risk >= 59
  - `critical_risk`: risk >= 87
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
| Neo4j/Memgraph | graph storage and traversal | account/session credentials | yes | no |
| RDF/SPARQL store | ontology-aligned semantic joins | account/session credentials | yes | no |
| NetworkX/graph-tool | offline graph analytics and diagnostics | none/local runtime | no | no |

## External Integration Migration Checklist
- Provision service credentials and validate non-expired auth before first run.
- Wire service outputs into validation/handoff artifacts.
- Enable credential reuse; prompt user only on missing/invalid/expired credentials.

## Credential Reuse Policy
- Reuse previously provided credentials by default; do not ask for new credentials when a valid credential/session already exists.
- Before prompting, check environment/session secret stores and run lightweight auth validation.
- Ask the user for credentials only if they are missing, invalid, expired, or explicitly revoked/rotated.

## Practical Usage Examples
1. Incident recovery in Communication and Explainability: ingest noisy signals, execute dependency graph compilation, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Comms Dependency DAG Planner against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for communication-and-explainability:planning-router, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `validated workflow DAGs`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `decision factors`, `uncertainty markers`, `audience summaries`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `communication-and-explainability:planning-router` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- Trigger alerts on repeated critical posture or validation regression spikes.
- KPI focus: `misinterpretation`, `trust erosion`, `decision drift`
- Primary outcome metric: `misinterpretation`
- Secondary metrics: `trust erosion`, `decision drift`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
