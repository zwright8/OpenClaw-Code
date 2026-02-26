---
name: u0581-observability-plan-quality-evaluator
description: Build and operate the "Observability Plan Quality Evaluator" capability for Data Quality and Observability. Trigger when this exact capability is needed in mission execution.
---

# Observability Plan Quality Evaluator

## Why This Skill Exists
We need this skill because decisions are only as good as the quality and visibility of data. This specific skill quantifies whether plans are complete, safe, and feasible.

## When To Use
Use this skill when the request explicitly needs "Observability Plan Quality Evaluator" outcomes in the Data Quality and Observability domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Observability Plan Quality Evaluator`, including at least three measurable KPIs tied to data drift and blind spots.
2. Design and version the input/output contract for freshness, drift, schema health, and telemetry coverage, then add schema validation and failure-mode handling.
3. Implement the core capability using multi-criteria plan scoring, and produce plan quality scorecards with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover data drift and blind spots, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
