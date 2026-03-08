---
name: u0489-research-resource-budget-allocator
description: Build and operate the "Research Resource Budget Allocator" capability for Scientific Research Systems. Trigger when this exact capability is needed in mission execution.
---

# Research Resource Budget Allocator

## Why This Skill Exists
We need this skill because research throughput degrades without reproducibility and prioritization. This specific skill matches mission ambition to finite execution capacity.

## When To Use
Use this skill when the request explicitly needs "Research Resource Budget Allocator" outcomes in the Scientific Research Systems domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Research Resource Budget Allocator`, including at least three measurable KPIs tied to non-reproducible results and wasted cycles.
2. Design and version the input/output contract for hypotheses, experiments, and replication evidence, then add schema validation and failure-mode handling.
3. Implement the core capability using capacity-aware allocation, and produce budgeted execution plans with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover non-reproducible results and wasted cycles, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
