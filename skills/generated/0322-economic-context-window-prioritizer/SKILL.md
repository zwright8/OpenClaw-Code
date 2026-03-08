---
name: u0322-economic-context-window-prioritizer
description: Build and operate the "Economic Context Window Prioritizer" capability for Economic Optimization. Trigger when this exact capability is needed in mission execution.
---

# Economic Context Window Prioritizer

## Why This Skill Exists
We need this skill because missions need explicit tradeoff logic for cost, speed, and impact. This specific skill surfaces the most decision-relevant context under tight token budgets.

## When To Use
Use this skill when the request explicitly needs "Economic Context Window Prioritizer" outcomes in the Economic Optimization domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Economic Context Window Prioritizer`, including at least three measurable KPIs tied to overspending and low-impact allocation.
2. Design and version the input/output contract for budgets, costs, benefits, and opportunity values, then add schema validation and failure-mode handling.
3. Implement the core capability using importance scoring, and produce ranked context bundles with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover overspending and low-impact allocation, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
