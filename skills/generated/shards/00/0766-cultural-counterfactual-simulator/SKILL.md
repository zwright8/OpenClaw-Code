---
name: u0766-cultural-counterfactual-simulator
description: Run the Cultural Counterfactual Simulator capability for Multilingual and Cultural Adaptation with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Cultural Counterfactual Simulator

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `766` |
| Domain | `Multilingual and Cultural Adaptation` |
| Runtime archetype | `simulation-lab` |
| Core method | `counterfactual replay` |
| Primary artifact | `scenario comparison reports` |
| Routing tag | `multilingual-and-cultural-adaptation:simulation-lab` |
| Feature flag | `skill_0766_cultural-counterfactual-simulato` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because global utility requires language and cultural context fidelity. This specific skill tests alternatives before costly commitments.

## Trigger Checklist
- [ ] The task explicitly needs Cultural Counterfactual Simulator (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| language variants | signal | yes | upstream/operator |
| cultural norms | signal | yes | upstream/operator |
| local preferences | signal | yes | upstream/operator |
| claims | signal | yes | upstream/operator |
| evidence | signal | yes | upstream/operator |
| confidence traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| scenario comparison reports | structured-artifact | yes | downstream orchestrator |
| scenario comparison reports-scorecard | scorecard | yes | operator / reviewer |
| scenario comparison reports-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Cultural Counterfactual Simulator`, including at least three measurable KPIs tied to context mismatch and exclusion.
2. Design and version the input/output contract for language variants, cultural norms, and local preferences, then add schema validation and failure-mode handling.
3. Implement the core capability using counterfactual replay, and produce scenario comparison reports with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover context mismatch and exclusion, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Cultural Counterfactual Simulator.

### Execution
- Execute counterfactual replay deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Cultural Counterfactual Simulator as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 72):** release artifacts after validation pass and route to `multilingual-and-cultural-adaptation:simulation-lab`.
- **Review posture (score >= 56 or risk >= 56):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 89):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Cultural Counterfactual Simulator`, including at least three measurable KPIs tied to context mismatch and exclusion.
- **Contract:** Design and version the input/output contract for language variants, cultural norms, and local preferences, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using counterfactual replay, and produce scenario comparison reports with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover context mismatch and exclusion, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.36, execution=0.31, safety=0.13, impact=0.19`
- Posture thresholds:
  - `ready`: score >= 72
  - `review`: score >= 56
  - `review_risk`: risk >= 56
  - `critical_risk`: risk >= 89
- Retry policy: max attempts `3`, base delay `750ms`, backoff `exponential`.
- Approval gates: `policy-constraint-check`, `human-approval-router`, `scenario-review`.

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
| Required approvals | `policy-constraint-check`, `human-approval-router`, `scenario-review` |

## Acceptance Checklist
- [ ] Schema, determinism, policy, and reliability gates all pass.
- [ ] Output artifact bundle includes scorecard, risks, and next actions.
- [ ] Handoff owner confirms artifact usability without additional clarification.
- [ ] Telemetry and trace references are attached for auditability.

## External Tool Stack Recommendation
| Field | Value |
|---|---|
| Recommendation class | `hybrid` |
| Migration priority | `P1` |
| External auth required | `yes` |
| API key likely required | `yes` |
| Rationale | Use external systems for persistence/enforcement/math and frontier models for synthesis and language-heavy reasoning. |

| Service | Why in stack | Auth mode | Auth required | API key likely |
|---|---|---|---|---|
| Frontier model runtime | reasoning and synthesis | model provider credentials | yes | yes |
| Task/workflow orchestrator | durable execution and retries | account/session credentials | yes | no |
| Telemetry store | evidence and observability | account/session credentials | yes | no |

## External Integration Migration Checklist
- Provision service credentials and validate non-expired auth before first run.
- Wire service outputs into validation/handoff artifacts.
- Enable credential reuse; prompt user only on missing/invalid/expired credentials.

## Credential Reuse Policy
- Reuse previously provided credentials by default; do not ask for new credentials when a valid credential/session already exists.
- Before prompting, check environment/session secret stores and run lightweight auth validation.
- Ask the user for credentials only if they are missing, invalid, expired, or explicitly revoked/rotated.

## Practical Usage Examples
1. Incident recovery in Multilingual and Cultural Adaptation: ingest noisy signals, execute counterfactual replay, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Cultural Counterfactual Simulator against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for multilingual-and-cultural-adaptation:simulation-lab, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `scenario comparison reports`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `language variants`, `cultural norms`, `local preferences`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `multilingual-and-cultural-adaptation:simulation-lab` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- Trigger alerts on repeated critical posture or validation regression spikes.
- KPI focus: `context mismatch`, `exclusion`, `decision drift`
- Primary outcome metric: `context mismatch`
- Secondary metrics: `exclusion`, `decision drift`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
