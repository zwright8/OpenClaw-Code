---
name: u08602-scientific-hypothesis-prioritization-for-personal-health-routines
description: Run the Scientific Hypothesis Prioritization for personal health routines capability for personal health routines with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Scientific Hypothesis Prioritization for personal health routines

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `8602` |
| Domain | `personal health routines` |
| Runtime archetype | `hypothesis-engine` |
| Core method | `scientific hypothesis prioritization` |
| Primary artifact | `scientific-hypothesis-prioritization-artifact-personal-health-ro` |
| Routing tag | `personal-health-routines:hypothesis-engine` |
| Feature flag | `skill_08602_scientific-hypothesis-prioriti` |
| Release cycles | `2` |

## Why This Skill Exists
Use scientific hypothesis prioritization in personal health routines with emphasis on safety, dignity, equity, and long-term societal benefit.

## Trigger Checklist
- [ ] The task explicitly needs Scientific Hypothesis Prioritization for personal health routines (not generic brainstorming).
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
| scientific-hypothesis-prioritization-artifact-personal-health-ro | structured-artifact | yes | downstream orchestrator |
| scientific-hypothesis-prioritization-artifact-personal-health-ro-scorecard | scorecard | yes | operator / reviewer |
| scientific-hypothesis-prioritization-artifact-personal-health-ro-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define measurable outcomes for Scientific Hypothesis Prioritization for personal health routines, including baseline and target metrics for personal health routines.
2. Specify structured inputs/outputs for scientific hypothesis prioritization and validate schema contract edge cases.
3. Implement the core scientific hypothesis prioritization logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Scientific Hypothesis Prioritization for personal health routines under pro-humanity impact conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
### Preflight
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

### Execution
- Execute scientific hypothesis prioritization workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

### Recovery
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

### Handoff
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Operator Use Cases
- Run Scientific Hypothesis Prioritization for personal health routines as a repeatable production workflow for humans and agents.
- Use Scientific Hypothesis Prioritization for personal health routines to accelerate decisions while preserving safety, quality, and auditability.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| quality | Require unit and integration validations before promoting Scientific Hypothesis Prioritization for personal health routines. | run-validation:unit+integration+simulation+regression-baseline |
| reliability | Trigger rollback on critical posture or repeated failures. | rollback:rollback-to-last-stable-baseline |
| compliance | Require policy and approval gates prior to autonomous deployment. | approval-gates:policy-constraint-check+human-impact-review |
| safety | Block production action when risk posture is critical until human oversight review. | open-incident:human-oversight |

## Posture Playbook
- **Ready posture (score >= 74):** release artifacts after validation pass and route to `personal-health-routines:hypothesis-engine`.
- **Review posture (score >= 54 or risk >= 62):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 81):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define measurable outcomes for Scientific Hypothesis Prioritization for personal health routines, including baseline and target metrics for personal health routines.
- **Contract:** Specify structured inputs/outputs for scientific hypothesis prioritization and validate schema contract edge cases.
- **Core:** Implement the core scientific hypothesis prioritization logic with deterministic scoring and reproducible execution traces.
- **Orchestration:** Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
- **Validation:** Run unit, integration, simulation, and regression suites for Scientific Hypothesis Prioritization for personal health routines under pro-humanity impact conditions.
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
| Maturity tier | `mission_critical` |
| Autopilot ready | `yes` |
| Parallelism | `2` |
| Max cycle minutes | `15` |
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
1. `LaunchDarkly/Unleash` -> auth preflight, execute read+write/orchestrate call(s), normalize output, and attach trace to `scientific-hypothesis-prioritization-artifact-personal-health-ro`.
2. `Statsig/Optimizely` -> auth preflight, execute read+write/orchestrate call(s), normalize output, and attach trace to `scientific-hypothesis-prioritization-artifact-personal-health-ro`.
3. `SciPy/Statsmodels` -> auth preflight, execute read/query call(s), normalize output, and attach trace to `scientific-hypothesis-prioritization-artifact-personal-health-ro`.
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
1. Incident recovery in personal health routines: ingest noisy signals, execute scientific hypothesis prioritization, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Scientific Hypothesis Prioritization for personal health routines against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for personal-health-routines:hypothesis-engine, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `scientific-hypothesis-prioritization-artifact-personal-health-ro`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `stakeholders`, `harm signals`, `benefit pathways`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `personal-health-routines:hypothesis-engine` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.9% successful runs per 7-day window
- Error budget: <=0.1% critical failures per 7-day window
- Alert triggers:
- critical posture exceeds baseline trend
- validation regression crosses threshold
- hardening or approval bottlenecks persist
- KPI focus: `harm reduction`, `equity improvement`, `human benefit in personal health routines`
- Primary outcome metric: `harm reduction`
- Secondary metrics: `equity improvement`, `human benefit in personal health routines`
- Review cadence: `daily`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
