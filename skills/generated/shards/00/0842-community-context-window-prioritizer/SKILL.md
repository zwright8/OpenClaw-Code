---
name: u0842-community-context-window-prioritizer
description: Run the Community Context Window Prioritizer capability for Community Engagement and Feedback with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Community Context Window Prioritizer

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `842` |
| Domain | `Community Engagement and Feedback` |
| Runtime archetype | `planning-router` |
| Core method | `importance scoring` |
| Primary artifact | `ranked context bundles` |
| Routing tag | `community-engagement-and-feedback:planning-router` |
| Feature flag | `skill_0842_community-context-window-priorit` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because real-world feedback loops are necessary for continuous alignment. This specific skill surfaces the most decision-relevant context under tight token budgets.

## Trigger Checklist
- [ ] The task explicitly needs Community Context Window Prioritizer (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| feedback channels | signal | yes | upstream/operator |
| sentiment | signal | yes | upstream/operator |
| urgency | signal | yes | upstream/operator |
| follow-ups | signal | yes | upstream/operator |
| claims | signal | yes | upstream/operator |
| evidence | signal | yes | upstream/operator |
| confidence traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| ranked context bundles | structured-artifact | yes | downstream orchestrator |
| ranked context bundles-scorecard | scorecard | yes | operator / reviewer |
| ranked context bundles-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Community Context Window Prioritizer`, including at least three measurable KPIs tied to community trust loss and unaddressed concerns.
2. Design and version the input/output contract for feedback channels, sentiment, urgency, and follow-ups, then add schema validation and failure-mode handling.
3. Implement the core capability using importance scoring, and produce ranked context bundles with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover community trust loss and unaddressed concerns, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Community Context Window Prioritizer.

### Execution
- Execute importance scoring deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Community Context Window Prioritizer as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 78):** release artifacts after validation pass and route to `community-engagement-and-feedback:planning-router`.
- **Review posture (score >= 55 or risk >= 55):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 83):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Community Context Window Prioritizer`, including at least three measurable KPIs tied to community trust loss and unaddressed concerns.
- **Contract:** Design and version the input/output contract for feedback channels, sentiment, urgency, and follow-ups, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using importance scoring, and produce ranked context bundles with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover community trust loss and unaddressed concerns, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.24, execution=0.23, safety=0.34, impact=0.19`
- Posture thresholds:
  - `ready`: score >= 78
  - `review`: score >= 55
  - `review_risk`: risk >= 55
  - `critical_risk`: risk >= 83
- Retry policy: max attempts `3`, base delay `900ms`, backoff `exponential`.
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
| External auth required | `no` |
| API key likely required | `no` |
| Rationale | Use external systems for persistence/enforcement/math and frontier models for synthesis and language-heavy reasoning. |

| Service | Why in stack | Auth mode | Auth required | API key likely |
|---|---|---|---|---|
| OR-Tools/Pyomo | constraint optimization and budget allocation | none/local runtime | no | no |
| Pandas/Polars | deterministic metric computations | none/local runtime | no | no |
| Great Expectations | data quality assertions before scoring | none/local runtime | no | no |

## Tool Inventory Highlights
| Tool | Role in execution | Call pattern | Mutating |
|---|---|---|---|
| OR-Tools/Pyomo | constraint optimization and budget allocation | read+write | yes |
| Pandas/Polars | deterministic metric computations | read+write | yes |
| Great Expectations | data quality assertions before scoring | read/query | no |

## API Protocols & Credential Requirements
| Tool | Primary protocol(s) | Auth mode | Auth required | API key needed | Operator action |
|---|---|---|---|---|---|
| OR-Tools/Pyomo | Local runtime/library API | none/local runtime | no | no | No external credential expected; execute with local/runtime context. |
| Pandas/Polars | Local runtime/library API | none/local runtime | no | no | No external credential expected; execute with local/runtime context. |
| Great Expectations | HTTPS/REST | none/local runtime | no | no | No external credential expected; execute with local/runtime context. |

## Tool Call Implementation
- Use the following deterministic call sequence for this skill:
1. `OR-Tools/Pyomo` -> auth preflight, execute read+write call(s), normalize output, and attach trace to `ranked context bundles`.
2. `Pandas/Polars` -> auth preflight, execute read+write call(s), normalize output, and attach trace to `ranked context bundles`.
3. `Great Expectations` -> auth preflight, execute read/query call(s), normalize output, and attach trace to `ranked context bundles`.
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
1. Incident recovery in Community Engagement and Feedback: ingest noisy signals, execute importance scoring, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Community Context Window Prioritizer against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for community-engagement-and-feedback:planning-router, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `ranked context bundles`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `feedback channels`, `sentiment`, `urgency`, `follow-ups`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `community-engagement-and-feedback:planning-router` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- Trigger alerts on repeated critical posture or validation regression spikes.
- KPI focus: `community trust loss`, `unaddressed concerns`, `decision drift`
- Primary outcome metric: `community trust loss`
- Secondary metrics: `unaddressed concerns`, `decision drift`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
