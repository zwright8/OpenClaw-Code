---
name: u0738-comms-memory-consolidation-pipeline
description: Build and operate the "Comms Memory Consolidation Pipeline" capability for Communication and Explainability. Trigger when this exact capability is needed in mission execution.
---

# Comms Memory Consolidation Pipeline

## Why This Skill Exists
We need this skill because complex systems require explanations humans can act on quickly. This specific skill turns raw logs into durable reusable memory.

## When To Use
Use this skill when the request explicitly needs "Comms Memory Consolidation Pipeline" outcomes in the Communication and Explainability domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Comms Memory Consolidation Pipeline`, including at least three measurable KPIs tied to misinterpretation and trust erosion.
2. Design and version the input/output contract for decision factors, uncertainty markers, and audience summaries, then add schema validation and failure-mode handling.
3. Implement the core capability using episodic-to-semantic consolidation, and produce consolidated memory snapshots with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover misinterpretation and trust erosion, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Runtime profile: general-capability using episodic-to-semantic consolidation to produce consolidated memory snapshots.
- Orchestration integration: communication-and-explainability:general-capability routing, approval gates, retries, and rollback controls.
- Validation evidence: unit, integration, simulation, regression-baseline suites and rollout telemetry.

## Operational Runbook
### Preflight
- Confirm the Comms Memory Consolidation Pipeline request scope, source evidence, and measurable success criteria before execution.
- Verify feature flag skill_0738_comms-memory-consolidation-pipel, approval gates, and rollback owner before autonomous use.

### Execution
- Execute episodic-to-semantic consolidation with deterministic scoring and reproducible trace capture.
- Produce consolidated memory snapshots plus scorecard, assumptions, and unresolved-risk notes.

### Recovery
- Fail closed when required signals, evidence, or approval gates are missing.
- Rollback to the last stable baseline when posture is critical or validation fails.

### Handoff
- Publish consolidated memory snapshots, validation evidence, and telemetry links to downstream owners.
- Queue follow-up tasks for unresolved risks, threshold tuning, or approval review.

## Guardrails
- [quality] Require deterministic scoring and validation evidence before promotion.
- [reliability] Preserve retries, rollback controls, and failure-mode evidence for every run.
- [safety] Route critical posture or missing approval gates to human review before autonomous action.
