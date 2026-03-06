---
name: u0979-evolution-knowledge-graph-linker
description: Run the Evolution Knowledge Graph Linker capability for Autonomous Learning and Evolution with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Evolution Knowledge Graph Linker

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `979` |
| Domain | `Autonomous Learning and Evolution` |
| Runtime archetype | `general-capability` |
| Core method | `entity and relation linking` |
| Primary artifact | `linked knowledge entities` |
| Routing tag | `autonomous-learning-and-evolution:general-capability` |
| Feature flag | `skill_0979_evolution-knowledge-graph-linker` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because agents stagnate without structured reflection and continuous improvement loops. This specific skill connects fragmented facts into reusable structures.

## Trigger Checklist
- [ ] The task explicitly needs Evolution Knowledge Graph Linker (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| outcomes | signal | yes | upstream/operator |
| error taxonomies | signal | yes | upstream/operator |
| adaptation decisions | signal | yes | upstream/operator |
| claims | signal | yes | upstream/operator |
| evidence | signal | yes | upstream/operator |
| confidence traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| linked knowledge entities | structured-artifact | yes | downstream orchestrator |
| linked knowledge entities-scorecard | scorecard | yes | operator / reviewer |
| linked knowledge entities-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Evolution Knowledge Graph Linker`, including at least three measurable KPIs tied to capability stagnation and repeated blind spots.
2. Design and version the input/output contract for outcomes, error taxonomies, and adaptation decisions, then add schema validation and failure-mode handling.
3. Implement the core capability using entity and relation linking, and produce linked knowledge entities with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover capability stagnation and repeated blind spots, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Evolution Knowledge Graph Linker.

### Execution
- Execute entity and relation linking deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Evolution Knowledge Graph Linker as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 71):** release artifacts after validation pass and route to `autonomous-learning-and-evolution:general-capability`.
- **Review posture (score >= 56 or risk >= 50):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 79):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Evolution Knowledge Graph Linker`, including at least three measurable KPIs tied to capability stagnation and repeated blind spots.
- **Contract:** Design and version the input/output contract for outcomes, error taxonomies, and adaptation decisions, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using entity and relation linking, and produce linked knowledge entities with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover capability stagnation and repeated blind spots, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.27, execution=0.21, safety=0.26, impact=0.26`
- Posture thresholds:
  - `ready`: score >= 71
  - `review`: score >= 56
  - `review_risk`: risk >= 50
  - `critical_risk`: risk >= 79
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
| Neo4j/Memgraph | graph storage and traversal | account/session credentials | yes | no |
| RDF/SPARQL store | ontology-aligned semantic joins | account/session credentials | yes | no |
| NetworkX/graph-tool | offline graph analytics and diagnostics | none/local runtime | no | no |

## Tool Inventory Highlights
| Tool | Role in execution | Call pattern | Mutating |
|---|---|---|---|
| Neo4j/Memgraph | graph storage and traversal | read/query | no |
| RDF/SPARQL store | ontology-aligned semantic joins | read/query | no |
| NetworkX/graph-tool | offline graph analytics and diagnostics | read/query | no |

## API Protocols & Credential Requirements
| Tool | Primary protocol(s) | Auth mode | Auth required | API key needed | Operator action |
|---|---|---|---|---|---|
| Neo4j/Memgraph | Bolt, HTTPS/REST | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |
| RDF/SPARQL store | SPARQL over HTTP | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |
| NetworkX/graph-tool | Local runtime/library API | none/local runtime | no | no | No external credential expected; execute with local/runtime context. |

## Tool Call Implementation
- Use the following deterministic call sequence for this skill:
1. `Neo4j/Memgraph` -> auth preflight, execute read/query call(s), normalize output, and attach trace to `linked knowledge entities`.
2. `RDF/SPARQL store` -> auth preflight, execute read/query call(s), normalize output, and attach trace to `linked knowledge entities`.
3. `NetworkX/graph-tool` -> auth preflight, execute read/query call(s), normalize output, and attach trace to `linked knowledge entities`.
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
1. Incident recovery in Autonomous Learning and Evolution: ingest noisy signals, execute entity and relation linking, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Evolution Knowledge Graph Linker against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for autonomous-learning-and-evolution:general-capability, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `linked knowledge entities`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `outcomes`, `error taxonomies`, `adaptation decisions`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `autonomous-learning-and-evolution:general-capability` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- Trigger alerts on repeated critical posture or validation regression spikes.
- KPI focus: `capability stagnation`, `repeated blind spots`, `decision drift`
- Primary outcome metric: `capability stagnation`
- Secondary metrics: `repeated blind spots`, `decision drift`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
