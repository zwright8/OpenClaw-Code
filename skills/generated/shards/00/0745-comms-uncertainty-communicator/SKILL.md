---
name: u0745-comms-uncertainty-communicator
description: Run the Comms Uncertainty Communicator capability for Communication and Explainability with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Comms Uncertainty Communicator

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `745` |
| Domain | `Communication and Explainability` |
| Runtime archetype | `communication-engine` |
| Core method | `confidence-bound communication templates` |
| Primary artifact | `uncertainty briefs` |
| Routing tag | `communication-and-explainability:communication-engine` |
| Feature flag | `skill_0745_comms-uncertainty-communicator` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because complex systems require explanations humans can act on quickly. This specific skill prevents overstatement by explicitly framing uncertainty.

## Trigger Checklist
- [ ] The task explicitly needs Comms Uncertainty Communicator (not generic brainstorming).
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
| uncertainty briefs | structured-artifact | yes | downstream orchestrator |
| uncertainty briefs-scorecard | scorecard | yes | operator / reviewer |
| uncertainty briefs-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Comms Uncertainty Communicator`, including at least three measurable KPIs tied to misinterpretation and trust erosion.
2. Design and version the input/output contract for decision factors, uncertainty markers, and audience summaries, then add schema validation and failure-mode handling.
3. Implement the core capability using confidence-bound communication templates, and produce uncertainty briefs with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover misinterpretation and trust erosion, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Comms Uncertainty Communicator.

### Execution
- Execute confidence-bound communication templates deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Comms Uncertainty Communicator as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 75):** release artifacts after validation pass and route to `communication-and-explainability:communication-engine`.
- **Review posture (score >= 47 or risk >= 42):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 73):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Comms Uncertainty Communicator`, including at least three measurable KPIs tied to misinterpretation and trust erosion.
- **Contract:** Design and version the input/output contract for decision factors, uncertainty markers, and audience summaries, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using confidence-bound communication templates, and produce uncertainty briefs with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover misinterpretation and trust erosion, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.24, execution=0.28, safety=0.27, impact=0.21`
- Posture thresholds:
  - `ready`: score >= 75
  - `review`: score >= 47
  - `review_risk`: risk >= 42
  - `critical_risk`: risk >= 73
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
| Recommendation class | `model-primary` |
| Migration priority | `P2` |
| External auth required | `yes` |
| API key likely required | `yes` |
| Rationale | Primary value is language reasoning/communication; external services are optional accelerators. |

| Service | Why in stack | Auth mode | Auth required | API key likely |
|---|---|---|---|---|
| Frontier model runtime | primary synthesis, tone, and judgment | model provider credentials | yes | yes |
| Vector memory store (optional) | long-term retrieval augmentation | account/session credentials | maybe | no |

## External Integration Migration Checklist
- Provision service credentials and validate non-expired auth before first run.
- Wire service outputs into validation/handoff artifacts.
- Enable credential reuse; prompt user only on missing/invalid/expired credentials.

## Credential Reuse Policy
- Reuse previously provided credentials by default; do not ask for new credentials when a valid credential/session already exists.
- Before prompting, check environment/session secret stores and run lightweight auth validation.
- Ask the user for credentials only if they are missing, invalid, expired, or explicitly revoked/rotated.

## Practical Usage Examples
1. Incident recovery in Communication and Explainability: ingest noisy signals, execute confidence-bound communication templates, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Comms Uncertainty Communicator against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for communication-and-explainability:communication-engine, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `uncertainty briefs`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `decision factors`, `uncertainty markers`, `audience summaries`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `communication-and-explainability:communication-engine` consumers with approval context attached.

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
