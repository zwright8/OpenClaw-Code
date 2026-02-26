---
name: u0546-engineering-experiment-design-generator
description: Build and operate the "Engineering Experiment Design Generator" capability for Software Engineering Automation. Trigger when this exact capability is needed in mission execution.
---

# Engineering Experiment Design Generator

## Why This Skill Exists
We need this skill because delivery speed must increase without sacrificing correctness. This specific skill converts unknowns into testable learning loops.

## When To Use
Use this skill when the request explicitly needs "Engineering Experiment Design Generator" outcomes in the Software Engineering Automation domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Engineering Experiment Design Generator`, including at least three measurable KPIs tied to regressions and brittle release pipelines.
2. Design and version the input/output contract for code changes, tests, incidents, and rollout data, then add schema validation and failure-mode handling.
3. Implement the core capability using hypothesis-driven design, and produce experiment plans with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover regressions and brittle release pipelines, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
