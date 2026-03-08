---
name: u0847-community-goal-decomposer
description: Build and operate the "Community Goal Decomposer" capability for Community Engagement and Feedback. Trigger when this exact capability is needed in mission execution.
---

# Community Goal Decomposer

## Why This Skill Exists
We need this skill because real-world feedback loops are necessary for continuous alignment. This specific skill breaks ambiguous missions into executable units.

## When To Use
Use this skill when the request explicitly needs "Community Goal Decomposer" outcomes in the Community Engagement and Feedback domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Community Goal Decomposer`, including at least three measurable KPIs tied to community trust loss and unaddressed concerns.
2. Design and version the input/output contract for feedback channels, sentiment, urgency, and follow-ups, then add schema validation and failure-mode handling.
3. Implement the core capability using hierarchical decomposition, and produce atomic task trees with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover community trust loss and unaddressed concerns, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
