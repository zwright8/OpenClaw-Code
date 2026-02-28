---
name: u0178-governance-memory-consolidation-pipeline
description: Build and operate the "Governance Memory Consolidation Pipeline" capability for Safety and Governance. Use only when production execution explicitly requires this exact capability and output contract.
---

# Governance Memory Consolidation Pipeline

## Why This Skill Exists
We need this skill because high-speed autonomy needs enforceable guardrails to stay aligned. This specific skill turns raw logs into durable reusable memory.

## Production Trigger Criteria
- Trigger only when the requested outcome explicitly maps to **Governance Memory Consolidation Pipeline** in the **Safety and Governance** capability family.
- Require a named production consumer and execution window before running (no exploratory/ad-hoc execution).
- Require complete upstream signals; if any required signal is absent, stop and return a remediation request (fail closed).

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Governance Memory Consolidation Pipeline`, including at least three measurable KPIs tied to unsafe actions and policy drift.
2. Design and version the input/output contract for policies, violations, and mitigation actions, then add schema validation and failure-mode handling.
3. Implement the core capability using episodic-to-semantic consolidation, and produce consolidated memory snapshots with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover unsafe actions and policy drift, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Constraints
- Core method: episodic-to-semantic consolidation
- Archetype: general-capability
- Routing tag: safety-and-governance:general-capability
- Determinism tolerance: repeated runs on identical normalized inputs must keep score/output delta within **<= 0.5%**.
- Retry budget: max 3 attempts with exponential backoff; then rollback.

## Input Contract
- `policies` (signal, source=upstream, required=true)
- `violations` (signal, source=upstream, required=true)
- `mitigation actions` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `consolidated_memory_snapshots_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `consolidated_memory_snapshots_scorecard` (scorecard, consumer=operator, guaranteed=true)

## Validation Gates (Fail-Closed)
1. **schema-contract-check** — Reject execution unless all required inputs are present and schema-valid (on fail: quarantine + remediation request).
2. **determinism-check** — Re-run fixed test vector; block publish-level output if variance exceeds 0.5% (on fail: escalate + hold).
3. **policy-approval-check** — Enforce policy gates before any publish-level artifact (on fail: block).
4. **high-risk-human-signoff** — If risk >= critical threshold or policy marks high-impact, require explicit human approval before release (on fail: block).

## Failure Handling
- `E_INPUT_SCHEMA`: Missing or malformed required signals → Reject payload, emit validation error, request corrected payload
- `E_NON_DETERMINISM`: Determinism delta exceeds allowed threshold → Freeze output, escalate to human approval router
- `E_DEPENDENCY_TIMEOUT`: Downstream or external dependency timeout → Apply retry policy then rollback to last stable baseline
- Rollback strategy: rollback-to-last-stable-baseline

## Handoff Contract
- Produces: Governance Memory Consolidation Pipeline normalized artifacts; execution scorecard; risk posture
- Consumes: policies; violations; mitigation actions; claims; evidence; confidence traces
- Downstream routing hint: Route next to safety-and-governance:general-capability consumers with approval-gate context

## Immediate Hardening Additions (Required Before Promotion)
- Add/refresh fixture file: `fixtures/golden-input.json` with deterministic sample payload and expected checksum.
- Add/refresh regression case: `tests/regression-case.md` for highest-risk failure path and expected fail-closed behavior.
- Emit machine-readable run summary to `hardening-summary.json` with fields: `status`, `risk_score`, `confidence`, `next_handoff`, `human_signoff_required`.
- Do not emit publish-level outputs when any validation gate fails.

## Production Trigger Clarity
- Use only when this capability produces production-facing outcomes with measurable acceptance criteria.
- Do not invoke for exploratory brainstorming or unrelated domains; route those requests to the correct capability family.

## Deterministic Tolerances
- Repeated runs on identical inputs must remain within **<=1% output variance** for scoring fields and preserve schema-identical artifact shape.
- Any variance beyond tolerance is a hard failure and must trigger escalation.

## Fail-Closed Validation Gates
1. Schema validity gate (required inputs present and valid).
2. Determinism gate (variance within tolerance).
3. Policy/approval gate (required approvals satisfied).

If any gate fails: **block output publication and fail closed**.

## High-Risk Human Sign-Off
- Any high-risk change, policy-impacting output, or publish-level action requires explicit human sign-off before release.
- Missing sign-off is a blocking condition.

## Explicit Handoff Contract
- **Produces:** normalized artifacts, decision scorecard, risk/confidence metadata.
- **Consumes:** validated upstream inputs for this capability.
- **Next hop:** route only to declared downstream consumers with gate/approval context attached.


## Trigger Checklist
- [ ] The request explicitly needs **Governance Memory Consolidation Pipeline** outcomes (not generic brainstorming).
- [ ] Inputs are sufficient to execute in **Safety and Governance** with measurable acceptance criteria.
- [ ] A downstream consumer is identified for the output artifacts (operator/orchestrator/audit log).
- [ ] If any item is false, route to discovery/scoping first instead of invoking this skill.

## Operational Cadence (Day / Week / Month)
- **Daily:** Run when new safety and governance signals arrive or when active decisions depend on this capability.
- **Weekly:** Review thresholds, drift, and failure telemetry; calibrate decision rules and retry policy.
- **Monthly:** Re-baseline deterministic expectations, archive evidence, and refresh approval/handoff assumptions.

## Practical Usage Examples
1. **Incident stabilization in Safety and Governance**
   - Input: noisy upstream payload requiring governance memory consolidation pipeline normalization/assessment.
   - Expected output: schema-valid artifact bundle + scorecard + explicit next-hop routing hint.
   - Handoff: orchestrator receives deterministic result package for gated downstream execution.
2. **Planned delivery quality check**
   - Input: scheduled batch with known baseline and acceptance metrics.
   - Expected output: pass/fail gate results, variance notes, and publish/no-publish recommendation.
   - Handoff: operator receives execution summary with risk/confidence and approval requirements.

## Anti-Patterns (Do Not Use)
- Do **not** use for open-ended ideation where success metrics and contracts are undefined.
- Do **not** bypass schema/policy gates to force output publication under time pressure.
- Do **not** treat non-deterministic or partial outputs as release-ready artifacts.
- Do **not** invoke this skill when a different capability family is the true bottleneck.

## When To Use
Use this when a request in **Safety and Governance** depends on **Governance Memory Consolidation Pipeline** outcomes with explicit acceptance criteria. Do not use for unconstrained ideation; route discovery work before invoking this execution skill.
