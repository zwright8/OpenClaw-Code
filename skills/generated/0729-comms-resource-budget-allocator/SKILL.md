---
name: u0729-comms-resource-budget-allocator
description: Build and operate the "Comms Resource Budget Allocator" capability for Communication and Explainability. Trigger when this exact capability is needed in mission execution.
---

# Comms Resource Budget Allocator

## Why This Skill Exists
We need this skill because complex systems require explanations humans can act on quickly. This specific skill matches mission ambition to finite execution capacity.

## When To Use
Use this skill when the request explicitly needs "Comms Resource Budget Allocator" outcomes in the Communication and Explainability domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Comms Resource Budget Allocator`, including at least three measurable KPIs tied to misinterpretation and trust erosion.
2. Design and version the input/output contract for decision factors, uncertainty markers, and audience summaries, then add schema validation and failure-mode handling.
3. Implement the core capability using capacity-aware allocation, and produce budgeted execution plans with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover misinterpretation and trust erosion, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
