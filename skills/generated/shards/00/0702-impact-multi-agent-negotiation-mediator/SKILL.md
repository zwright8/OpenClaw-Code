---
name: u0702-impact-multi-agent-negotiation-mediator
description: Operate the "Impact Multi-Agent Negotiation Mediator" capability in production for  workflows. Use when mission execution explicitly requires this capability and outcomes must be reproducible, policy-gated, and handoff-ready.
---

# Impact Multi-Agent Negotiation Mediator

## Why This Skill Exists
We need this skill because missions need measurable outcomes, not just activity volume. This specific skill resolves resource and strategy conflicts with explicit tradeoffs.

## When To Use
Use this skill when the request explicitly needs "Impact Multi-Agent Negotiation Mediator" outcomes in the Social Impact Measurement domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Impact Multi-Agent Negotiation Mediator`, including at least three measurable KPIs tied to impact theater and unmeasured harm.
2. Design and version the input/output contract for community outcomes, KPI trends, and intervention deltas, then add schema validation and failure-mode handling.
3. Implement the core capability using structured bargaining protocols, and produce negotiated agreement sets with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover impact theater and unmeasured harm, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: structured bargaining protocols
- Archetype: collaboration-mediator
- Routing tag: social-impact-measurement:collaboration-mediator

## Input Contract
- `community outcomes` (signal, source=upstream, required=true)
- `kpi trends` (signal, source=upstream, required=true)
- `intervention deltas` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `negotiated_agreement_sets_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `negotiated_agreement_sets_scorecard` (scorecard, consumer=operator, guaranteed=true)

## Validation Gates
1. **schema-contract-check** — All required input signals present and schema-valid (on fail: quarantine)
2. **determinism-check** — Repeated run on same inputs yields stable scoring and artifacts (on fail: escalate)
3. **policy-approval-check** — Approval gates satisfied before publish-level outputs (on fail: retry)

## Failure Handling
- `E_INPUT_SCHEMA`: Missing or malformed required signals → Reject payload, emit validation error, request corrected payload
- `E_NON_DETERMINISM`: Determinism delta exceeds allowed threshold → Freeze output, escalate to human approval router
- `E_DEPENDENCY_TIMEOUT`: Downstream or external dependency timeout → Apply retry policy then rollback to last stable baseline
- Rollback strategy: rollback-to-last-stable-baseline

## Handoff Contract
- Produces: Impact Multi-Agent Negotiation Mediator normalized artifacts; execution scorecard; risk posture
- Consumes: community outcomes; kpi trends; intervention deltas; claims; evidence; confidence traces
- Downstream routing hint: Route next to social-impact-measurement:collaboration-mediator consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.

## Trigger Checklist
- [ ] The request explicitly needs **Impact Multi-Agent Negotiation Mediator** outcomes (not generic brainstorming).
- [ ] Inputs are sufficient to execute in **workflows** with measurable acceptance criteria.
- [ ] A downstream consumer is identified for the output artifacts (operator/orchestrator/audit log).
- [ ] If any item is false, route to discovery/scoping first instead of invoking this skill.

## Operational Cadence (Day / Week / Month)
- **Daily:** Run when new workflows signals arrive or when active decisions depend on this capability.
- **Weekly:** Review thresholds, drift, and failure telemetry; calibrate decision rules and retry policy.
- **Monthly:** Re-baseline deterministic expectations, archive evidence, and refresh approval/handoff assumptions.

## Practical Usage Examples
1. **Incident stabilization in workflows**
   - Input: noisy upstream payload requiring impact multi-agent negotiation mediator normalization/assessment.
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
