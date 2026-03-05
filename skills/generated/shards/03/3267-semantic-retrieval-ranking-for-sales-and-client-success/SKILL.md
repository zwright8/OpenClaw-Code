---
name: u03267-semantic-retrieval-ranking-for-sales-and-client-success
description: Run the Semantic Retrieval Ranking for sales and client success capability for sales and client success with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Semantic Retrieval Ranking for sales and client success

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `3267` |
| Domain | `sales and client success` |
| Runtime archetype | `retrieval-engine` |
| Core method | `semantic retrieval ranking` |
| Primary artifact | `semantic-retrieval-ranking-artifact-sales-and-client-success` |
| Routing tag | `sales-and-client-success:retrieval-engine` |
| Feature flag | `skill_03267_semantic-retrieval-ranking` |
| Release cycles | `2` |

## Why This Skill Exists
Use semantic retrieval ranking in sales and client success with emphasis on safety, dignity, equity, and long-term societal benefit.

## Trigger Checklist
- [ ] The task explicitly needs Semantic Retrieval Ranking for sales and client success (not generic brainstorming).
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
| semantic-retrieval-ranking-artifact-sales-and-client-success | structured-artifact | yes | downstream orchestrator |
| semantic-retrieval-ranking-artifact-sales-and-client-success-scorecard | scorecard | yes | operator / reviewer |
| semantic-retrieval-ranking-artifact-sales-and-client-success-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define measurable outcomes for Semantic Retrieval Ranking for sales and client success, including baseline and target metrics for sales and client success.
2. Specify structured inputs/outputs for semantic retrieval ranking and validate schema contract edge cases.
3. Implement the core semantic retrieval ranking logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Semantic Retrieval Ranking for sales and client success under pro-humanity impact conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
### Preflight
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

### Execution
- Execute semantic retrieval ranking workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

### Recovery
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

### Handoff
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Operator Use Cases
- Run Semantic Retrieval Ranking for sales and client success as a repeatable production workflow for humans and agents.
- Use Semantic Retrieval Ranking for sales and client success to accelerate decisions while preserving safety, quality, and auditability.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| quality | Require unit and integration validations before promoting Semantic Retrieval Ranking for sales and client success. | run-validation:unit+integration+simulation+regression-baseline |
| reliability | Trigger rollback on critical posture or repeated failures. | rollback:rollback-to-last-stable-baseline |
| cost | Respect bounded resource pressure and execution budget during scaling. | budget-guard:resource-pressure-cap |

## Posture Playbook
- **Ready posture (score >= 74):** release artifacts after validation pass and route to `sales-and-client-success:retrieval-engine`.
- **Review posture (score >= 54 or risk >= 62):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 81):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define measurable outcomes for Semantic Retrieval Ranking for sales and client success, including baseline and target metrics for sales and client success.
- **Contract:** Specify structured inputs/outputs for semantic retrieval ranking and validate schema contract edge cases.
- **Core:** Implement the core semantic retrieval ranking logic with deterministic scoring and reproducible execution traces.
- **Orchestration:** Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
- **Validation:** Run unit, integration, simulation, and regression suites for Semantic Retrieval Ranking for sales and client success under pro-humanity impact conditions.
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
| Maturity tier | `foundation` |
| Autopilot ready | `yes` |
| Parallelism | `4` |
| Max cycle minutes | `25` |
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
1. `OpenSearch/Elasticsearch` -> auth preflight, execute read/query call(s), normalize output, and attach trace to `semantic-retrieval-ranking-artifact-sales-and-client-success`.
2. `Qdrant/Weaviate/pgvector` -> auth preflight, execute read/query call(s), normalize output, and attach trace to `semantic-retrieval-ranking-artifact-sales-and-client-success`.
3. `Cohere/Jina reranker` -> auth preflight, execute read+write call(s), normalize output, and attach trace to `semantic-retrieval-ranking-artifact-sales-and-client-success`.
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
1. Incident recovery in sales and client success: ingest noisy signals, execute semantic retrieval ranking, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Semantic Retrieval Ranking for sales and client success against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for sales-and-client-success:retrieval-engine, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `semantic-retrieval-ranking-artifact-sales-and-client-success`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `stakeholders`, `harm signals`, `benefit pathways`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `sales-and-client-success:retrieval-engine` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- critical posture exceeds baseline trend
- validation regression crosses threshold
- hardening or approval bottlenecks persist
- KPI focus: `harm reduction`, `equity improvement`, `human benefit in sales and client success`
- Primary outcome metric: `harm reduction`
- Secondary metrics: `equity improvement`, `human benefit in sales and client success`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
