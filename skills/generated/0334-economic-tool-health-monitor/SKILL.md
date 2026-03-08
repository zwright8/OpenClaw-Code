---
name: u0334-economic-tool-health-monitor
description: Build and operate the "Economic Tool Health Monitor" capability for Economic Optimization. Trigger when this exact capability is needed in mission execution.
---

# Economic Tool Health Monitor

## Why This Skill Exists
We need this skill because missions need explicit tradeoff logic for cost, speed, and impact. This specific skill detects tool flakiness before it impacts mission outcomes.

## When To Use
Use this skill when the request explicitly needs "Economic Tool Health Monitor" outcomes in the Economic Optimization domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Economic Tool Health Monitor`, including at least three measurable KPIs tied to overspending and low-impact allocation.
2. Design and version the input/output contract for budgets, costs, benefits, and opportunity values, then add schema validation and failure-mode handling.
3. Implement the core capability using telemetry aggregation and SLO checks, and produce tool reliability scores with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover overspending and low-impact allocation, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
