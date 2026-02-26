---
name: u0483-research-evidence-provenance-tracker
description: Build and operate the "Research Evidence Provenance Tracker" capability for Scientific Research Systems. Trigger when this exact capability is needed in mission execution.
---

# Research Evidence Provenance Tracker

## Why This Skill Exists
We need this skill because research throughput degrades without reproducibility and prioritization. This specific skill preserves source lineage so claims remain auditable.

## When To Use
Use this skill when the request explicitly needs "Research Evidence Provenance Tracker" outcomes in the Scientific Research Systems domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Research Evidence Provenance Tracker`, including at least three measurable KPIs tied to non-reproducible results and wasted cycles.
2. Design and version the input/output contract for hypotheses, experiments, and replication evidence, then add schema validation and failure-mode handling.
3. Implement the core capability using signed provenance links, and produce evidence lineage graphs with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover non-reproducible results and wasted cycles, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: signed provenance links
- Archetype: provenance-tracker
- Routing tag: scientific-research-systems:provenance-tracker

## Input Contract
- `hypotheses` (signal, source=upstream, required=true)
- `experiments` (signal, source=upstream, required=true)
- `replication evidence` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `evidence_lineage_graphs_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `evidence_lineage_graphs_scorecard` (scorecard, consumer=operator, guaranteed=true)

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
- Produces: Research Evidence Provenance Tracker normalized artifacts; execution scorecard; risk posture
- Consumes: hypotheses; experiments; replication evidence; claims; evidence; confidence traces
- Downstream routing hint: Route next to scientific-research-systems:provenance-tracker consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
