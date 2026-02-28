---
name: u0253-collab-task-handoff-contractor
description: Operate the "Collab Task Handoff Contractor" capability in production for Collaboration and Negotiation workflows. Use when mission execution explicitly requires this capability and outcomes must be reproducible, policy-gated, and handoff-ready.
---

# Collab Task Handoff Contractor

## Why This Skill Exists
This skill hardens a generated capability for production execution so collaboration workflows remain deterministic, auditable, and fail-closed under risk.

## When To Use
Use this skill only when the request explicitly needs `Collab Task Handoff Contractor` in Collaboration and Negotiation and a downstream consumer requires contract-bound artifacts.

## Step-by-Step Implementation Guide
1. Validate production trigger criteria: explicit capability request, approved source-tagged inputs, and named downstream consumer.
2. Enforce deterministic normalization workflow with pinned mapping/ruleset versions and stable serialization order.
3. Apply explicit determinism tolerance checks (score delta <= 0.005 absolute; identical input must produce zero artifact hash drift).
4. Execute fail-closed validation gates (schema, determinism, policy-risk) and block output on any failure.
5. Require explicit human sign-off token for high-risk runs before publication or downstream routing.
6. Emit handoff envelope with artifact paths, gate results, risk tier, and approval state for the next stage.

## Deterministic Workflow Constraints
- Replay score variance: <= 0.005 absolute per item.
- Artifact hash drift for identical replay: 0 allowed.
- Time-dependent fields allowed only in metadata and excluded from scoring.

## Validation Gates
1. **schema-gate** — all required fields present and schema-valid; otherwise block and return error bundle.
2. **determinism-gate** — replay output within tolerance; otherwise quarantine and escalate.
3. **policy-risk-gate** — policy and risk checks pass; otherwise block routing.
4. **approval-gate-high-risk** — if risk is high, require human sign-off token; otherwise fail closed.

## Handoff Contract
- Inputs: source-tagged signals, claims, evidence, confidence traces, run context.
- Outputs: deterministic artifact, scorecard, and handoff envelope with approval metadata.
- Routing rule: forward only when every gate passes; high-risk requires explicit sign-off token.

## Immediate Hardening Additions
- Fixture: `fixtures/minimal-valid.json`
- Regression case: `tests/regression-case.md`
- Machine-readable summary: `hardening-summary.json`

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
- [ ] The request explicitly needs **Collab Task Handoff Contractor** outcomes (not generic brainstorming).
- [ ] Inputs are sufficient to execute in **Collaboration and Negotiation workflows** with measurable acceptance criteria.
- [ ] A downstream consumer is identified for the output artifacts (operator/orchestrator/audit log).
- [ ] If any item is false, route to discovery/scoping first instead of invoking this skill.

## Operational Cadence (Day / Week / Month)
- **Daily:** Run when new collaboration and negotiation workflows signals arrive or when active decisions depend on this capability.
- **Weekly:** Review thresholds, drift, and failure telemetry; calibrate decision rules and retry policy.
- **Monthly:** Re-baseline deterministic expectations, archive evidence, and refresh approval/handoff assumptions.

## Practical Usage Examples
1. **Incident stabilization in Collaboration and Negotiation workflows**
   - Input: noisy upstream payload requiring collab task handoff contractor normalization/assessment.
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

## Output Contract
- `primary_artifact_bundle` (structured-report, consumer=orchestrator, guaranteed=true)
- `execution_scorecard` (scorecard, consumer=operator, guaranteed=true)
- `handoff_packet` (machine-readable, consumer=downstream-skill, guaranteed=true)
