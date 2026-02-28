---
name: u0882-rights-context-window-prioritizer
description: Operate the "Rights Context Window Prioritizer" capability in production for  workflows. Use when mission execution explicitly requires this capability and outcomes must be reproducible, policy-gated, and handoff-ready.
---

# Rights Context Window Prioritizer

## Why This Skill Exists
We need this skill because operations must preserve rights and satisfy jurisdictional obligations. This specific skill surfaces the most decision-relevant context under tight token budgets.

## When To Use
Use this skill when the request explicitly needs "Rights Context Window Prioritizer" outcomes in the Legal, Rights, and Compliance domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Rights Context Window Prioritizer`, including at least three measurable KPIs tied to rights violations and compliance penalties.
2. Design and version the input/output contract for requirements mappings, legal decisions, and evidence trails, then add schema validation and failure-mode handling.
3. Implement the core capability using importance scoring, and produce ranked context bundles with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover rights violations and compliance penalties, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: importance scoring
- Archetype: planning-router
- Routing tag: legal-rights-and-compliance:planning-router

## Input Contract
- `requirements mappings` (signal, source=upstream, required=true)
- `legal decisions` (signal, source=upstream, required=true)
- `evidence trails` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `ranked_context_bundles_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `ranked_context_bundles_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Rights Context Window Prioritizer normalized artifacts; execution scorecard; risk posture
- Consumes: requirements mappings; legal decisions; evidence trails; claims; evidence; confidence traces
- Downstream routing hint: Route next to legal-rights-and-compliance:planning-router consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.

## Trigger Checklist
- [ ] The request explicitly needs **Rights Context Window Prioritizer** outcomes (not generic brainstorming).
- [ ] Inputs are sufficient to execute in **workflows** with measurable acceptance criteria.
- [ ] A downstream consumer is identified for the output artifacts (operator/orchestrator/audit log).
- [ ] If any item is false, route to discovery/scoping first instead of invoking this skill.

## Operational Cadence (Day / Week / Month)
- **Daily:** Run when new workflows signals arrive or when active decisions depend on this capability.
- **Weekly:** Review thresholds, drift, and failure telemetry; calibrate decision rules and retry policy.
- **Monthly:** Re-baseline deterministic expectations, archive evidence, and refresh approval/handoff assumptions.

## Practical Usage Examples
1. **Incident stabilization in workflows**
   - Input: noisy upstream payload requiring rights context window prioritizer normalization/assessment.
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
