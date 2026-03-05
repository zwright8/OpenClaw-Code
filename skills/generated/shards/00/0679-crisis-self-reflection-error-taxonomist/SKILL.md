---
name: u0679-crisis-self-reflection-error-taxonomist
description: Run the Crisis Self-Reflection Error Taxonomist capability for Crisis and Incident Response with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Crisis Self-Reflection Error Taxonomist

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `679` |
| Domain | `Crisis and Incident Response` |
| Runtime archetype | `general-capability` |
| Core method | `failure-type clustering` |
| Primary artifact | `error taxonomies` |
| Routing tag | `crisis-and-incident-response:general-capability` |
| Feature flag | `skill_0679_crisis-self-reflection-error-tax` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because response quality determines whether incidents are contained or amplified. This specific skill classifies recurrent reasoning failures for targeted fixes.

## Trigger Checklist
- [ ] The task explicitly needs Crisis Self-Reflection Error Taxonomist (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| incident timelines | signal | yes | upstream/operator |
| response roles | signal | yes | upstream/operator |
| recovery artifacts | signal | yes | upstream/operator |
| claims | signal | yes | upstream/operator |
| evidence | signal | yes | upstream/operator |
| confidence traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| error taxonomies | structured-artifact | yes | downstream orchestrator |
| error taxonomies-scorecard | scorecard | yes | operator / reviewer |
| error taxonomies-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Crisis Self-Reflection Error Taxonomist`, including at least three measurable KPIs tied to slow containment and repeated outages.
2. Design and version the input/output contract for incident timelines, response roles, and recovery artifacts, then add schema validation and failure-mode handling.
3. Implement the core capability using failure-type clustering, and produce error taxonomies with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover slow containment and repeated outages, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Crisis Self-Reflection Error Taxonomist.

### Execution
- Execute failure-type clustering deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Crisis Self-Reflection Error Taxonomist as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 78):** release artifacts after validation pass and route to `crisis-and-incident-response:general-capability`.
- **Review posture (score >= 52 or risk >= 57):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 80):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Crisis Self-Reflection Error Taxonomist`, including at least three measurable KPIs tied to slow containment and repeated outages.
- **Contract:** Design and version the input/output contract for incident timelines, response roles, and recovery artifacts, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using failure-type clustering, and produce error taxonomies with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover slow containment and repeated outages, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.20, execution=0.32, safety=0.22, impact=0.25`
- Posture thresholds:
  - `ready`: score >= 78
  - `review`: score >= 52
  - `review_risk`: risk >= 57
  - `critical_risk`: risk >= 80
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
| Audit log + immutable storage | compliance-grade evidence retention | account/session credentials | yes | no |

## External Integration Migration Checklist
- Provision service credentials and validate non-expired auth before first run.
- Wire service outputs into validation/handoff artifacts.
- Enable credential reuse; prompt user only on missing/invalid/expired credentials.

## Credential Reuse Policy
- Reuse previously provided credentials by default; do not ask for new credentials when a valid credential/session already exists.
- Before prompting, check environment/session secret stores and run lightweight auth validation.
- Ask the user for credentials only if they are missing, invalid, expired, or explicitly revoked/rotated.

## Practical Usage Examples
1. Incident recovery in Crisis and Incident Response: ingest noisy signals, execute failure-type clustering, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Crisis Self-Reflection Error Taxonomist against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for crisis-and-incident-response:general-capability, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `error taxonomies`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `incident timelines`, `response roles`, `recovery artifacts`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `crisis-and-incident-response:general-capability` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- Trigger alerts on repeated critical posture or validation regression spikes.
- KPI focus: `slow containment`, `repeated outages`, `decision drift`
- Primary outcome metric: `slow containment`
- Secondary metrics: `repeated outages`, `decision drift`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
