---
name: u0800-cultural-continuous-improvement-planner
description: Operate the "Cultural Continuous Improvement Planner" capability in production for  workflows. Use when mission execution explicitly requires this capability and outcomes must be reproducible, policy-gated, and handoff-ready.
---

# Cultural Continuous Improvement Planner

## Why This Skill Exists
We need this skill because global utility requires language and cultural context fidelity. This specific skill turns findings into sustained upgrade cycles.

## When To Use
Use this skill when the request explicitly needs "Cultural Continuous Improvement Planner" outcomes in the Multilingual and Cultural Adaptation domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Cultural Continuous Improvement Planner`, including at least three measurable KPIs tied to context mismatch and exclusion.
2. Design and version the input/output contract for language variants, cultural norms, and local preferences, then add schema validation and failure-mode handling.
3. Implement the core capability using closed-loop prioritization, and produce improvement roadmaps with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover context mismatch and exclusion, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: closed-loop prioritization
- Archetype: planning-router
- Routing tag: multilingual-and-cultural-adaptation:planning-router

## Input Contract
- `language variants` (signal, source=upstream, required=true)
- `cultural norms` (signal, source=upstream, required=true)
- `local preferences` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `improvement_roadmaps_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `improvement_roadmaps_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Cultural Continuous Improvement Planner normalized artifacts; execution scorecard; risk posture
- Consumes: language variants; cultural norms; local preferences; claims; evidence; confidence traces
- Downstream routing hint: Route next to multilingual-and-cultural-adaptation:planning-router consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
