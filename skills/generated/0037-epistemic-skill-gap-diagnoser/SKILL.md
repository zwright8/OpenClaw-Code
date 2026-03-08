---
name: u0037-epistemic-skill-gap-diagnoser
description: Build and operate the "Epistemic Skill Gap Diagnoser" capability for Truth-Seeking and Epistemics. Trigger when this exact capability is needed in mission execution.
---

# Epistemic Skill Gap Diagnoser

## Why This Skill Exists
We need this skill because decisions drift when claims are accepted without verification. This specific skill identifies where agents and humans need capability upgrades.

## When To Use
Use this skill when the request explicitly needs "Epistemic Skill Gap Diagnoser" outcomes in the Truth-Seeking and Epistemics domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Epistemic Skill Gap Diagnoser`, including at least three measurable KPIs tied to false certainty and unverified assumptions.
2. Design and version the input/output contract for claims, evidence, and confidence traces, then add schema validation and failure-mode handling.
3. Implement the core capability using competency coverage analysis, and produce skill gap reports with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover false certainty and unverified assumptions, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
