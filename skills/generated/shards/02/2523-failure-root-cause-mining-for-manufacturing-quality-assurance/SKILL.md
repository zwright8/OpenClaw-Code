---
name: u02523-failure-root-cause-mining-for-manufacturing-quality-assurance
description: Run the Failure Root Cause Mining for manufacturing quality assurance capability for manufacturing quality assurance with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Failure Root Cause Mining for manufacturing quality assurance

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `2523` |
| Domain | `manufacturing quality assurance` |
| Runtime archetype | `diagnostic-engine` |
| Core method | `failure root cause mining` |
| Primary artifact | `failure-root-cause-mining-artifact-manufacturing-quality-assuran` |
| Routing tag | `manufacturing-quality-assurance:diagnostic-engine` |
| Feature flag | `skill_02523_failure-root-cause-mining` |
| Release cycles | `2` |

## Why This Skill Exists
Use failure root cause mining in manufacturing quality assurance with emphasis on clarity, harmony, craft, and emotionally resonant outcomes.

## Trigger Checklist
- [ ] The task explicitly needs Failure Root Cause Mining for manufacturing quality assurance (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| aesthetic constraints | signal | yes | upstream/operator |
| craft references | signal | yes | upstream/operator |
| experience traces | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| failure-root-cause-mining-artifact-manufacturing-quality-assuran | structured-artifact | yes | downstream orchestrator |
| failure-root-cause-mining-artifact-manufacturing-quality-assuran-scorecard | scorecard | yes | operator / reviewer |
| failure-root-cause-mining-artifact-manufacturing-quality-assuran-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define measurable outcomes for Failure Root Cause Mining for manufacturing quality assurance, including baseline and target metrics for manufacturing quality assurance.
2. Specify structured inputs/outputs for failure root cause mining and validate schema contract edge cases.
3. Implement the core failure root cause mining logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Failure Root Cause Mining for manufacturing quality assurance under beauty and aesthetic appreciation conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
### Preflight
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

### Execution
- Execute failure root cause mining workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

### Recovery
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

### Handoff
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Operator Use Cases
- Run Failure Root Cause Mining for manufacturing quality assurance as a repeatable production workflow for humans and agents.
- Use Failure Root Cause Mining for manufacturing quality assurance to accelerate decisions while preserving safety, quality, and auditability.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| quality | Require unit and integration validations before promoting Failure Root Cause Mining for manufacturing quality assurance. | run-validation:unit+integration+simulation+regression-baseline |
| reliability | Trigger rollback on critical posture or repeated failures. | rollback:rollback-to-last-stable-baseline |
| cost | Respect bounded resource pressure and execution budget during scaling. | budget-guard:resource-pressure-cap |

## Posture Playbook
- **Ready posture (score >= 74):** release artifacts after validation pass and route to `manufacturing-quality-assurance:diagnostic-engine`.
- **Review posture (score >= 54 or risk >= 62):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 81):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define measurable outcomes for Failure Root Cause Mining for manufacturing quality assurance, including baseline and target metrics for manufacturing quality assurance.
- **Contract:** Specify structured inputs/outputs for failure root cause mining and validate schema contract edge cases.
- **Core:** Implement the core failure root cause mining logic with deterministic scoring and reproducible execution traces.
- **Orchestration:** Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
- **Validation:** Run unit, integration, simulation, and regression suites for Failure Root Cause Mining for manufacturing quality assurance under beauty and aesthetic appreciation conditions.
- **Rollout:** Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.20, execution=0.20, safety=0.20, impact=0.40`
- Posture thresholds:
  - `ready`: score >= 74
  - `review`: score >= 54
  - `review_risk`: risk >= 62
  - `critical_risk`: risk >= 81
- Retry policy: max attempts `4`, base delay `750ms`, backoff `exponential`.
- Approval gates: `policy-constraint-check`, `quality-review`.

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
| Required approvals | `policy-constraint-check`, `quality-review` |

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
1. `Frontier model runtime` -> auth preflight, execute model inference call(s), normalize output, and attach trace to `failure-root-cause-mining-artifact-manufacturing-quality-assuran`.
2. `Task/workflow orchestrator` -> auth preflight, execute read+write call(s), normalize output, and attach trace to `failure-root-cause-mining-artifact-manufacturing-quality-assuran`.
3. `Telemetry store` -> auth preflight, execute read+write call(s), normalize output, and attach trace to `failure-root-cause-mining-artifact-manufacturing-quality-assuran`.
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
1. Incident recovery in manufacturing quality assurance: ingest noisy signals, execute failure root cause mining, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Failure Root Cause Mining for manufacturing quality assurance against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for manufacturing-quality-assurance:diagnostic-engine, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `failure-root-cause-mining-artifact-manufacturing-quality-assuran`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `aesthetic constraints`, `craft references`, `experience traces`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `manufacturing-quality-assurance:diagnostic-engine` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.5% successful runs per 7-day window
- Error budget: <=0.5% critical failures per 7-day window
- Alert triggers:
- critical posture exceeds baseline trend
- validation regression crosses threshold
- hardening or approval bottlenecks persist
- KPI focus: `aesthetic coherence`, `craft quality`, `delight in manufacturing quality assurance`
- Primary outcome metric: `aesthetic coherence`
- Secondary metrics: `craft quality`, `delight in manufacturing quality assurance`
- Review cadence: `weekly`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
