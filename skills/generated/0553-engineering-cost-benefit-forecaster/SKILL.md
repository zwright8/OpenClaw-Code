---
name: u0553-engineering-cost-benefit-forecaster
description: Build and operate the "Engineering Cost-Benefit Forecaster" capability for Software Engineering Automation. Trigger when this exact capability is needed in mission execution.
---

# Engineering Cost-Benefit Forecaster

## Why This Skill Exists
We need this skill because delivery speed must increase without sacrificing correctness. This specific skill prioritizes actions with the strongest net value.

## When To Use
Use this skill when the request explicitly needs "Engineering Cost-Benefit Forecaster" outcomes in the Software Engineering Automation domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Engineering Cost-Benefit Forecaster`, including at least three measurable KPIs tied to regressions and brittle release pipelines.
2. Design and version the input/output contract for code changes, tests, incidents, and rollout data, then add schema validation and failure-mode handling.
3. Implement the core capability using cost-impact simulation, and produce forecasted ROI scenarios with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover regressions and brittle release pipelines, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
