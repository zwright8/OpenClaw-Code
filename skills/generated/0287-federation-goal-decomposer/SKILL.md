---
name: u0287-federation-goal-decomposer
description: Build and operate the "Federation Goal Decomposer" capability for Federation and Interoperability. Trigger when this exact capability is needed in mission execution.
---

# Federation Goal Decomposer

## Why This Skill Exists
We need this skill because cross-org collaboration fails without shared contracts and trust primitives. This specific skill breaks ambiguous missions into executable units.

## When To Use
Use this skill when the request explicitly needs "Federation Goal Decomposer" outcomes in the Federation and Interoperability domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Federation Goal Decomposer`, including at least three measurable KPIs tied to integration breakage and trust boundary violations.
2. Design and version the input/output contract for envelopes, tenant boundaries, and protocol bridges, then add schema validation and failure-mode handling.
3. Implement the core capability using hierarchical decomposition, and produce atomic task trees with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover integration breakage and trust boundary violations, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
