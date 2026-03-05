---
name: u01700-human-approval-routing-for-disaster-response-networks
description: Run the Human Approval Routing for disaster response networks capability for disaster response networks with deterministic outputs, policy-gated release, and handoff-ready operational artifacts. Use when mission execution explicitly requires this capability.
---

# Human Approval Routing for disaster response networks

## Quick Reference
| Field | Value |
|---|---|
| Skill ID | `1700` |
| Domain | `disaster response networks` |
| Runtime archetype | `generalist-engine` |
| Core method | `human approval routing` |
| Primary artifact | `human-approval-routing-artifact-disaster-response-networks` |
| Routing tag | `disaster-response-networks:generalist-engine` |
| Feature flag | `skill_01700_human-approval-routing` |
| Release cycles | `2` |

## Why This Skill Exists
Use human approval routing in disaster response networks with emphasis on best-in-class standards, precision, and repeatable excellence.

## Trigger Checklist
- [ ] The task explicitly needs Human Approval Routing for disaster response networks (not generic brainstorming).
- [ ] Inputs are sufficient and source provenance is available.
- [ ] Success criteria are measurable and agreed before execution.
- [ ] A downstream owner/consumer for handoff is identified.
- [ ] If risk is high, human approval path is available before publish.

## Inputs (contract)
| Input | Type | Required | Source |
|---|---|---|---|
| quality standards | signal | yes | upstream/operator |
| skill rubrics | signal | yes | upstream/operator |
| performance metrics | signal | yes | upstream/operator |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| human-approval-routing-artifact-disaster-response-networks | structured-artifact | yes | downstream orchestrator |
| human-approval-routing-artifact-disaster-response-networks-scorecard | scorecard | yes | operator / reviewer |
| human-approval-routing-artifact-disaster-response-networks-handoff | handoff-packet | yes | next owner |

## Implementation Guide
1. Define measurable outcomes for Human Approval Routing for disaster response networks, including baseline and target metrics for disaster response networks.
2. Specify structured inputs/outputs for human approval routing and validate schema contract edge cases.
3. Implement the core human approval routing logic with deterministic scoring and reproducible execution traces.
4. Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
5. Run unit, integration, simulation, and regression suites for Human Approval Routing for disaster response networks under professional mastery conditions.
6. Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Operational Runbook
### Preflight
- Validate mission scope, contracts, and required inputs.
- Verify feature flag posture, dependencies, and approval prerequisites.

### Execution
- Execute human approval routing workflow with deterministic scoring and trace capture.
- Track posture transitions and preserve reproducible evidence artifacts.

### Recovery
- Apply rollback strategy if posture is critical or guardrails fail.
- Escalate blocked execution to oversight with incident packet and trace references.

### Handoff
- Publish outcome report, scorecard, and telemetry links.
- Queue follow-up tasks for unresolved risks, approvals, or optimization work.

## Operator Use Cases
- Run Human Approval Routing for disaster response networks as a repeatable production workflow for humans and agents.
- Use Human Approval Routing for disaster response networks to accelerate decisions while preserving safety, quality, and auditability.

## Guardrail Policy Matrix
| Guardrail Type | Policy Rule | Automation Hook |
|---|---|---|
| quality | Require unit and integration validations before promoting Human Approval Routing for disaster response networks. | run-validation:unit+integration+simulation+regression-baseline |
| reliability | Trigger rollback on critical posture or repeated failures. | rollback:rollback-to-last-stable-baseline |
| compliance | Require policy and approval gates prior to autonomous deployment. | approval-gates:policy-constraint-check+human-approval-router |
| safety | Block production action when risk posture is critical until human oversight review. | open-incident:human-oversight |

## Posture Playbook
- **Ready posture (score >= 74):** release artifacts after validation pass and route to `disaster-response-networks:generalist-engine`.
- **Review posture (score >= 54 or risk >= 62):** require human review before publish, with explicit remediation notes.
- **Critical posture (risk >= 81):** fail closed, execute `rollback-to-last-stable-baseline`, and escalate with incident packet.

## Traceability Map
- **Scope:** Define measurable outcomes for Human Approval Routing for disaster response networks, including baseline and target metrics for disaster response networks.
- **Contract:** Specify structured inputs/outputs for human approval routing and validate schema contract edge cases.
- **Core:** Implement the core human approval routing logic with deterministic scoring and reproducible execution traces.
- **Orchestration:** Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.
- **Validation:** Run unit, integration, simulation, and regression suites for Human Approval Routing for disaster response networks under professional mastery conditions.
- **Rollout:** Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.

## Decision & Scoring Policy
- Scoring weights: `truth=0.30, execution=0.35, safety=0.20, impact=0.15`
- Posture thresholds:
  - `ready`: score >= 74
  - `review`: score >= 54
  - `review_risk`: risk >= 62
  - `critical_risk`: risk >= 81
- Retry policy: max attempts `4`, base delay `750ms`, backoff `exponential`.
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
| Maturity tier | `mission_critical` |
| Autopilot ready | `yes` |
| Parallelism | `2` |
| Max cycle minutes | `15` |
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
| API key likely required | `no` |
| Rationale | Use external systems for persistence/enforcement/math and frontier models for synthesis and language-heavy reasoning. |

| Service | Why in stack | Auth mode | Auth required | API key likely |
|---|---|---|---|---|
| OPA/Rego | policy decision enforcement | account/session credentials | yes | no |
| Vault/KMS | secret and key lifecycle management | account/session credentials | yes | no |
| SIEM (Elastic/Splunk) | security event evidence and audit trails | account/session credentials | yes | no |

## Tool Inventory Highlights
| Tool | Role in execution | Call pattern | Mutating |
|---|---|---|---|
| OPA/Rego | policy decision enforcement | read+write/orchestrate | yes |
| Vault/KMS | secret and key lifecycle management | read+write/orchestrate | yes |
| SIEM (Elastic/Splunk) | security event evidence and audit trails | read+write | yes |

## API Protocols & Credential Requirements
| Tool | Primary protocol(s) | Auth mode | Auth required | API key needed | Operator action |
|---|---|---|---|---|---|
| OPA/Rego | HTTPS/REST | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |
| Vault/KMS | HTTPS/REST | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |
| SIEM (Elastic/Splunk) | HTTPS/REST | account/session credentials | yes | no | Reuse current account/session credentials; validate context before execution. |

## Tool Call Implementation
- Use the following deterministic call sequence for this skill:
1. `OPA/Rego` -> auth preflight, execute read+write/orchestrate call(s), normalize output, and attach trace to `human-approval-routing-artifact-disaster-response-networks`.
2. `Vault/KMS` -> auth preflight, execute read+write/orchestrate call(s), normalize output, and attach trace to `human-approval-routing-artifact-disaster-response-networks`.
3. `SIEM (Elastic/Splunk)` -> auth preflight, execute read+write call(s), normalize output, and attach trace to `human-approval-routing-artifact-disaster-response-networks`.
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
1. Incident recovery in disaster response networks: ingest noisy signals, execute human approval routing, produce an operator-ready scorecard and remediation queue.
2. Scheduled quality pass: run Human Approval Routing for disaster response networks against baseline data, compare drift, and publish release/no-release recommendation with evidence links.
3. Pre-deployment gate: validate artifacts for disaster-response-networks:generalist-engine, enforce approvals, then handoff to downstream orchestrator with next actions.

## Anti-Patterns
- Do not publish artifacts when any validation gate fails.
- Do not bypass approval gates for high-risk runs.
- Do not run with missing provenance, schema, or success criteria.
- Do not treat partial/non-deterministic outputs as production-ready.

## Handoff Contract
- **Produces:** `human-approval-routing-artifact-disaster-response-networks`, scorecard, risk/confidence metadata, remediation backlog.
- **Consumes:** `quality standards`, `skill rubrics`, `performance metrics`.
- **Readiness rule:** release only when schema, determinism, policy, and reliability gates all pass.
- **Downstream hint:** route only to `disaster-response-networks:generalist-engine` consumers with approval context attached.

## Observability & Continuous Improvement
- SLO: >=99.9% successful runs per 7-day window
- Error budget: <=0.1% critical failures per 7-day window
- Alert triggers:
- critical posture exceeds baseline trend
- validation regression crosses threshold
- hardening or approval bottlenecks persist
- KPI focus: `quality score`, `consistency index`, `mastery progress in disaster response networks`
- Primary outcome metric: `quality score`
- Secondary metrics: `consistency index`, `mastery progress in disaster response networks`
- Review cadence: `daily`
- Weekly review: tune thresholds, retries, and approval friction based on telemetry and incident learnings.
