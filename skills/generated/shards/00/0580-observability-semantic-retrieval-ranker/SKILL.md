---
name: u0580-observability-semantic-retrieval-ranker
description: Run the Observability Semantic Retrieval Ranker capability for Data Quality and Observability with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Observability Semantic Retrieval Ranker

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `580` |
| Domain | `Data Quality and Observability` |
| Runtime archetype | `planning-router` |
| Core method | `semantic relevance scoring` |
| Primary artifact | `ranked retrieval results` |
| Routing tag | `data-quality-and-observability:planning-router` |
| Feature flag | `skill_0580_observability-semantic-retrieval` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because decisions are only as good as the quality and visibility of data. This specific skill improves recall precision for downstream decision quality.

## Trigger Checklist
- [ ] The task explicitly needs Observability Semantic Retrieval Ranker (not generic brainstorming).
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
| ranked retrieval results | structured-artifact | yes | downstream orchestrator |
| ranked retrieval results-scorecard | scorecard | yes | operator / reviewer |
| ranked retrieval results-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Observability Semantic Retrieval Ranker`, including at least three measurable KPIs tied to data drift and blind spots.
2. Design and version the input/output contract for freshness, drift, schema health, and telemetry coverage, then add schema validation and failure-mode handling.
3. Implement the core capability using semantic relevance scoring, and produce ranked retrieval results with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover data drift and blind spots, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Observability Semantic Retrieval Ranker.

### Execution
- Execute semantic relevance scoring deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Observability Semantic Retrieval Ranker as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 78):** release artifacts after validation pass and route to `data-quality-and-observability:planning-router`.
- **Review posture (score >= 57 or risk >= 58):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 84):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Observability Semantic Retrieval Ranker`, including at least three measurable KPIs tied to data drift and blind spots.
- **Contract:** Design and version the input/output contract for freshness, drift, schema health, and telemetry coverage, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using semantic relevance scoring, and produce ranked retrieval results with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover data drift and blind spots, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.20, execution=0.19, safety=0.42, impact=0.19`
- Posture thresholds:
  - `ready`: score >= 78
  - `review`: score >= 57
  - `review_risk`: risk >= 58
  - `critical_risk`: risk >= 84
- Retry policy: max attempts `3`, base delay `600ms`, backoff `exponential`.
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
| API key likely required | `yes` |
| Rationale | Deterministic infrastructure and system primitives outperform model-only execution for reliability and auditability. |

| Service | Why in stack | Auth mode | Auth required | API key likely |
|---|---|---|---|---|
| OpenSearch/Elasticsearch | lexical retrieval and filtering | account/session credentials | yes | no |
| Qdrant/Weaviate/pgvector | vector retrieval and nearest-neighbor recall | account/session credentials | yes | no |
| Cohere/Jina reranker | cross-encoder reranking quality lift | API key | yes | yes |

## Tool Inventory Highlights
| Tool | Role in execution | Call pattern | Mutating |
|---|---|---|---|
| OpenSearch/Elasticsearch | lexical retrieval and filtering | read/query | no |
| Qdrant/Weaviate/pgvector | vector retrieval and nearest-neighbor recall | read/query | no |
| Cohere/Jina reranker | cross-encoder reranking quality lift | read+write | yes |

## API Protocols & Credential Requirements
| Tool | Primary protocol(s) | Auth mode | Auth required | API key needed | Operator action |
|---|---|---|---|---|---|
| OpenSearch/Elasticsearch | HTTPS/REST | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |
| Qdrant/Weaviate/pgvector | HTTPS/REST, gRPC | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |
| Cohere/Jina reranker | HTTPS/REST | API key | yes | yes | Check existing API key first; validate with lightweight auth request; prompt only if missing/invalid/expired. |

## Tool Call Implementation
- Use the following deterministic call sequence for this skill:
1. `OpenSearch/Elasticsearch` -> auth preflight, execute read/query call(s), normalize output, and attach trace to `ranked retrieval results`.
2. `Qdrant/Weaviate/pgvector` -> auth preflight, execute read/query call(s), normalize output, and attach trace to `ranked retrieval results`.
3. `Cohere/Jina reranker` -> auth preflight, execute read+write call(s), normalize output, and attach trace to `ranked retrieval results`.
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
1. Incident recovery in Data Quality and Observability: ingest noisy signals, execute semantic relevance scoring, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Observability Semantic Retrieval Ranker against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for data-quality-and-observability:planning-router, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `ranked retrieval results`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `freshness`, `drift`, `schema health`, `telemetry coverage`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `data-quality-and-observability:planning-router` consumers with approval context attached.

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
