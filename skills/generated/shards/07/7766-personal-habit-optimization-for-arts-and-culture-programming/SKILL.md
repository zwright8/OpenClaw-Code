---
name: u07766-personal-habit-optimization-for-arts-and-culture-programming
description: Run the Personal Habit Optimization for arts and culture programming capability for arts and culture programming with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Personal Habit Optimization for arts and culture programming

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `7766` |
| Domain | `arts and culture programming` |
| Runtime archetype | `habit-optimization-engine` |
| Core method | `personal habit optimization` |
| Primary artifact | `personal-habit-optimization-artifact-arts-and-culture-programmin` |
| Routing tag | `arts-and-culture-programming:habit-optimization-engine` |
| Feature flag | `skill_07766_personal-habit-optimization` |
| Release cycles | `2` |

## Why This Skill Exists
Use personal habit optimization in arts and culture programming with emphasis on evidence quality, falsifiability, and calibration.

## Trigger Checklist
- [ ] The task explicitly needs Personal Habit Optimization for arts and culture programming (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| claims | signal | yes | upstream/operator |
| evidence | signal | yes | upstream/operator |
| confidence traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| personal-habit-optimization-artifact-arts-and-culture-programmin | structured-artifact | yes | downstream orchestrator |
| personal-habit-optimization-artifact-arts-and-culture-programmin-scorecard | scorecard | yes | operator / reviewer |
| personal-habit-optimization-artifact-arts-and-culture-programmin-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define measurable outcomes for Personal Habit Optimization for arts and culture programming, including baseline and target metrics for arts and culture programming.
2. Specify structured inputs/outputs for personal habit optimization and validate schema contract edge cases.
3. Implement the core personal habit optimization logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Personal Habit Optimization for arts and culture programming under maximally truth-seeking conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
### Preflight
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

### Execution
- Execute personal habit optimization workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

### Recovery
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

### Handoff
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Operator Use Cases
- Run Personal Habit Optimization for arts and culture programming as a repeatable production workflow for humans and agents.
- Use Personal Habit Optimization for arts and culture programming to accelerate decisions while preserving safety, quality, and auditability.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| quality | Require unit and integration validations before promoting Personal Habit Optimization for arts and culture programming. | run-validation:unit+integration+simulation+regression-baseline |
| reliability | Trigger rollback on critical posture or repeated failures. | rollback:rollback-to-last-stable-baseline |
| compliance | Require policy and approval gates prior to autonomous deployment. | approval-gates:policy-constraint-check+evidence-review |
| cost | Respect bounded resource pressure and execution budget during scaling. | budget-guard:resource-pressure-cap |

## Posture Playbook
- **Ready posture (score >= 74):** release artifacts after validation pass and route to `arts-and-culture-programming:habit-optimization-engine`.
- **Review posture (score >= 54 or risk >= 62):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 81):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define measurable outcomes for Personal Habit Optimization for arts and culture programming, including baseline and target metrics for arts and culture programming.
- **Contract:** Specify structured inputs/outputs for personal habit optimization and validate schema contract edge cases.
- **Core:** Implement the core personal habit optimization logic with deterministic scoring and reproducible execution traces.
- **Orchestration:** Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
- **Validation:** Run unit, integration, simulation, and regression suites for Personal Habit Optimization for arts and culture programming under maximally truth-seeking conditions.
- **Rollout:** Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.45, execution=0.20, safety=0.20, impact=0.15`
- Posture thresholds:
  - `ready`: score >= 74
  - `review`: score >= 54
  - `review_risk`: risk >= 62
  - `critical_risk`: risk >= 81
- Retry policy: max attempts `4`, base delay `750ms`, backoff `exponential`.
- Approval gates: `policy-constraint-check`, `evidence-review`.

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
| Maturity tier | `advanced` |
| Autopilot ready | `yes` |
| Parallelism | `3` |
| Max cycle minutes | `20` |
| Required approvals | `policy-constraint-check`, `evidence-review` |

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
1. `OR-Tools/Pyomo` -> auth preflight, execute read+write call(s), normalize output, and attach trace to `personal-habit-optimization-artifact-arts-and-culture-programmin`.
2. `Pandas/Polars` -> auth preflight, execute read+write call(s), normalize output, and attach trace to `personal-habit-optimization-artifact-arts-and-culture-programmin`.
3. `Great Expectations` -> auth preflight, execute read/query call(s), normalize output, and attach trace to `personal-habit-optimization-artifact-arts-and-culture-programmin`.
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
1. Incident recovery in arts and culture programming: ingest noisy signals, execute personal habit optimization, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Personal Habit Optimization for arts and culture programming against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for arts-and-culture-programming:habit-optimization-engine, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `personal-habit-optimization-artifact-arts-and-culture-programmin`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `arts-and-culture-programming:habit-optimization-engine` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.7% successful runs per 7-day window
- Error budget: <=0.3% critical failures per 7-day window
- Alert triggers:
- critical posture exceeds baseline trend
- validation regression crosses threshold
- hardening or approval bottlenecks persist
- KPI focus: `accuracy lift`, `contradiction reduction`, `evidence coverage in arts and culture programming`
- Primary outcome metric: `accuracy lift`
- Secondary metrics: `contradiction reduction`, `evidence coverage in arts and culture programming`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
