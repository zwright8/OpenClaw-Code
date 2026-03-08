---
name: u0649-crisis-resource-budget-allocator
description: Build and operate the "Crisis Resource Budget Allocator" capability for Crisis and Incident Response. Trigger when this exact capability is needed in mission execution.
---

# Crisis Resource Budget Allocator

## Why This Skill Exists
We need this skill because response quality determines whether incidents are contained or amplified. This specific skill matches mission ambition to finite execution capacity.

## When To Use
Use this skill when the request explicitly needs "Crisis Resource Budget Allocator" outcomes in the Crisis and Incident Response domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Crisis Resource Budget Allocator`, including at least three measurable KPIs tied to slow containment and repeated outages.
2. Design and version the input/output contract for incident timelines, response roles, and recovery artifacts, then add schema validation and failure-mode handling.
3. Implement the core capability using capacity-aware allocation, and produce budgeted execution plans with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover slow containment and repeated outages, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
