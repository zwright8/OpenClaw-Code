---
name: u0340-economic-semantic-retrieval-ranker
description: Build and operate the "Economic Semantic Retrieval Ranker" capability for Economic Optimization. Trigger when this exact capability is needed in mission execution.
---

# Economic Semantic Retrieval Ranker

## Why This Skill Exists
We need this skill because missions need explicit tradeoff logic for cost, speed, and impact. This specific skill improves recall precision for downstream decision quality.

## When To Use
Use this skill when the request explicitly needs "Economic Semantic Retrieval Ranker" outcomes in the Economic Optimization domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Economic Semantic Retrieval Ranker`, including at least three measurable KPIs tied to overspending and low-impact allocation.
2. Design and version the input/output contract for budgets, costs, benefits, and opportunity values, then add schema validation and failure-mode handling.
3. Implement the core capability using semantic relevance scoring, and produce ranked retrieval results with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover overspending and low-impact allocation, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: semantic relevance scoring
- Archetype: planning-router
- Routing tag: economic-optimization:planning-router

## Input Contract
- `budgets` (signal, source=upstream, required=true)
- `costs` (signal, source=upstream, required=true)
- `benefits` (signal, source=upstream, required=true)
- `opportunity values` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `ranked_retrieval_results_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `ranked_retrieval_results_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Economic Semantic Retrieval Ranker normalized artifacts; execution scorecard; risk posture
- Consumes: budgets; costs; benefits; opportunity values; claims; evidence; confidence traces
- Downstream routing hint: Route next to economic-optimization:planning-router consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
