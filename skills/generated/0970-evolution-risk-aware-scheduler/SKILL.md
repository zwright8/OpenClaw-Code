---
name: u0970-evolution-risk-aware-scheduler
description: Build and operate the "Evolution Risk-Aware Scheduler" capability for Autonomous Learning and Evolution. Trigger when this exact capability is needed in mission execution.
---

# Evolution Risk-Aware Scheduler

## Why This Skill Exists
We need this skill because agents stagnate without structured reflection and continuous improvement loops. This specific skill times execution based on risk posture instead of urgency alone.

## When To Use
Use this skill when the request explicitly needs "Evolution Risk-Aware Scheduler" outcomes in the Autonomous Learning and Evolution domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Evolution Risk-Aware Scheduler`, including at least three measurable KPIs tied to capability stagnation and repeated blind spots.
2. Design and version the input/output contract for outcomes, error taxonomies, and adaptation decisions, then add schema validation and failure-mode handling.
3. Implement the core capability using risk-weighted sequencing, and produce risk-gated schedules with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover capability stagnation and repeated blind spots, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
