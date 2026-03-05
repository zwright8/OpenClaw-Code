---
name: u0757-comms-skill-gap-diagnoser
description: Run the Comms Skill Gap Diagnoser capability for Communication and Explainability with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Comms Skill Gap Diagnoser

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `757` |
| Domain | `Communication and Explainability` |
| Runtime archetype | `general-capability` |
| Core method | `competency coverage analysis` |
| Primary artifact | `skill gap reports` |
| Routing tag | `communication-and-explainability:general-capability` |
| Feature flag | `skill_0757_comms-skill-gap-diagnoser` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because complex systems require explanations humans can act on quickly. This specific skill identifies where agents and humans need capability upgrades.

## Trigger Checklist
- [ ] The task explicitly needs Comms Skill Gap Diagnoser (not generic brainstorming).
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
| skill gap reports | structured-artifact | yes | downstream orchestrator |
| skill gap reports-scorecard | scorecard | yes | operator / reviewer |
| skill gap reports-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Comms Skill Gap Diagnoser`, including at least three measurable KPIs tied to misinterpretation and trust erosion.
2. Design and version the input/output contract for decision factors, uncertainty markers, and audience summaries, then add schema validation and failure-mode handling.
3. Implement the core capability using competency coverage analysis, and produce skill gap reports with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover misinterpretation and trust erosion, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Comms Skill Gap Diagnoser.

### Execution
- Execute competency coverage analysis deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Comms Skill Gap Diagnoser as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 71):** release artifacts after validation pass and route to `communication-and-explainability:general-capability`.
- **Review posture (score >= 42 or risk >= 38):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 67):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Comms Skill Gap Diagnoser`, including at least three measurable KPIs tied to misinterpretation and trust erosion.
- **Contract:** Design and version the input/output contract for decision factors, uncertainty markers, and audience summaries, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using competency coverage analysis, and produce skill gap reports with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover misinterpretation and trust erosion, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.27, execution=0.20, safety=0.29, impact=0.24`
- Posture thresholds:
  - `ready`: score >= 71
  - `review`: score >= 42
  - `review_risk`: risk >= 38
  - `critical_risk`: risk >= 67
- Retry policy: max attempts `4`, base delay `900ms`, backoff `exponential`.
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

## Tool Inventory Highlights
| Tool | Role in execution | Call pattern | Mutating |
|---|---|---|---|
| Frontier model runtime | reasoning and synthesis | model inference | no |
| Task/workflow orchestrator | durable execution and retries | read+write | yes |
| Telemetry store | evidence and observability | read+write | yes |

## API Protocols & Credential Requirements
| Tool | Primary protocol(s) | Auth mode | Auth required | API key needed | Operator action |
|---|---|---|---|---|---|
| Frontier model runtime | HTTPS/REST | model provider credentials | yes | yes | Check existing API key first; validate with lightweight auth request; prompt only if missing/invalid/expired. |
| Task/workflow orchestrator | HTTPS/REST, gRPC | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |
| Telemetry store | HTTPS/REST, OTLP or SQL | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |

## Tool Call Implementation
- Use the following deterministic call sequence for this skill:
1. `Frontier model runtime` -> auth preflight, execute model inference call(s), normalize output, and attach trace to `skill gap reports`.
2. `Task/workflow orchestrator` -> auth preflight, execute read+write call(s), normalize output, and attach trace to `skill gap reports`.
3. `Telemetry store` -> auth preflight, execute read+write call(s), normalize output, and attach trace to `skill gap reports`.
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
1. Incident recovery in Communication and Explainability: ingest noisy signals, execute competency coverage analysis, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Comms Skill Gap Diagnoser against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for communication-and-explainability:general-capability, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `skill gap reports`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `decision factors`, `uncertainty markers`, `audience summaries`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `communication-and-explainability:general-capability` consumers with approval context attached.

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
