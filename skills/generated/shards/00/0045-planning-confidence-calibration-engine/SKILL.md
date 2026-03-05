---
name: u0045-planning-confidence-calibration-engine
description: Run the Planning Confidence Calibration Engine capability for Strategic Planning and Decomposition with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Planning Confidence Calibration Engine

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `45` |
| Domain | `Strategic Planning and Decomposition` |
| Runtime archetype | `optimization-engine` |
| Core method | `calibration curves and error bins` |
| Primary artifact | `calibrated confidence scores` |
| Routing tag | `strategic-planning-and-decomposition:optimization-engine` |
| Feature flag | `skill_0045_planning-confidence-calibration-` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because large goals fail when decomposition is inconsistent or incomplete. This specific skill aligns reported confidence with actual uncertainty.

## Trigger Checklist
- [ ] The task explicitly needs Planning Confidence Calibration Engine (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| goals | signal | yes | upstream/operator |
| dependencies | signal | yes | upstream/operator |
| milestones | signal | yes | upstream/operator |
| constraints | signal | yes | upstream/operator |
| claims | signal | yes | upstream/operator |
| evidence | signal | yes | upstream/operator |
| confidence traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| calibrated confidence scores | structured-artifact | yes | downstream orchestrator |
| calibrated confidence scores-scorecard | scorecard | yes | operator / reviewer |
| calibrated confidence scores-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define the scope and success metrics for `Planning Confidence Calibration Engine`, including at least three measurable KPIs tied to execution stalls and hidden dependency failures.
2. Design and version the input/output contract for goals, dependencies, milestones, and constraints, then add schema validation and failure-mode handling.
3. Implement the core capability using calibration curves and error bins, and produce calibrated confidence scores with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover execution stalls and hidden dependency failures, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Operational Runbook
### Preflight
- Confirm scope, owner, and success criteria for Planning Confidence Calibration Engine.

### Execution
- Execute calibration curves and error bins deterministically and capture reproducible traces.

### Recovery
- Apply retry policy then rollback-to-last-stable-baseline when posture remains critical.

### Handoff
- Publish artifact bundle, scorecard, and next actions with clear ownership.

## Operator Use Cases
- Operate Planning Confidence Calibration Engine as a reliable, reusable production workflow.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| general | Enforce deterministic quality and policy constraints. | validation+approval gates |

## Posture Playbook
- **Ready posture (score >= 80):** release artifacts after validation pass and route to `strategic-planning-and-decomposition:optimization-engine`.
- **Review posture (score >= 58 or risk >= 49):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 74):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define the scope and success metrics for `Planning Confidence Calibration Engine`, including at least three measurable KPIs tied to execution stalls and hidden dependency failures.
- **Contract:** Design and version the input/output contract for goals, dependencies, milestones, and constraints, then add schema validation and failure-mode handling.
- **Core:** Implement the core capability using calibration curves and error bins, and produce calibrated confidence scores with deterministic scoring.
- **Orchestration:** Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
- **Validation:** Add unit, integration, and simulation tests that explicitly cover execution stalls and hidden dependency failures, then run regression baselines.
- **Rollout:** Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.31, execution=0.20, safety=0.25, impact=0.24`
- Posture thresholds:
  - `ready`: score >= 80
  - `review`: score >= 58
  - `review_risk`: risk >= 49
  - `critical_risk`: risk >= 74
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
| Recommendation class | `tool-primary` |
| Migration priority | `P0` |
| External auth required | `yes` |
| API key likely required | `no` |
| Rationale | Deterministic infrastructure and system primitives outperform model-only execution for reliability and auditability. |

| Service | Why in stack | Auth mode | Auth required | API key likely |
|---|---|---|---|---|
| LaunchDarkly/Unleash | feature flagging and staged rollout safety | account/session credentials | yes | no |
| Statsig/Optimizely | experiment assignment and decision stats | account/session credentials | yes | no |
| SciPy/Statsmodels | significance and confidence interval checks | none/local runtime | no | no |

## Tool Inventory Highlights
| Tool | Role in execution | Call pattern | Mutating |
|---|---|---|---|
| LaunchDarkly/Unleash | feature flagging and staged rollout safety | read+write/orchestrate | yes |
| Statsig/Optimizely | experiment assignment and decision stats | read+write/orchestrate | yes |
| SciPy/Statsmodels | significance and confidence interval checks | read/query | no |

## API Protocols & Credential Requirements
| Tool | Primary protocol(s) | Auth mode | Auth required | API key needed | Operator action |
|---|---|---|---|---|---|
| LaunchDarkly/Unleash | HTTPS/REST | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |
| Statsig/Optimizely | HTTPS/REST | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |
| SciPy/Statsmodels | Local runtime/library API | none/local runtime | no | no | No external credential expected; execute with local/runtime context. |

## Tool Call Implementation
- Use the following deterministic call sequence for this skill:
1. `LaunchDarkly/Unleash` -> auth preflight, execute read+write/orchestrate call(s), normalize output, and attach trace to `calibrated confidence scores`.
2. `Statsig/Optimizely` -> auth preflight, execute read+write/orchestrate call(s), normalize output, and attach trace to `calibrated confidence scores`.
3. `SciPy/Statsmodels` -> auth preflight, execute read/query call(s), normalize output, and attach trace to `calibrated confidence scores`.
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
1. Incident recovery in Strategic Planning and Decomposition: ingest noisy signals, execute calibration curves and error bins, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Planning Confidence Calibration Engine against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for strategic-planning-and-decomposition:optimization-engine, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `calibrated confidence scores`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `goals`, `dependencies`, `milestones`, `constraints`, `claims`, `evidence`, `confidence traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `strategic-planning-and-decomposition:optimization-engine` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- Trigger alerts on repeated critical posture or validation regression spikes.
- KPI focus: `execution stalls`, `hidden dependency failures`, `decision drift`
- Primary outcome metric: `execution stalls`
- Secondary metrics: `hidden dependency failures`, `decision drift`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
