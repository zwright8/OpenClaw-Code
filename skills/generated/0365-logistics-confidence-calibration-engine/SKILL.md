---
name: u0365-logistics-confidence-calibration-engine
description: Build and operate the "Logistics Confidence Calibration Engine" capability for Resource Allocation and Logistics. Trigger when this exact capability is needed in mission execution.
---

# Logistics Confidence Calibration Engine

## Why This Skill Exists
We need this skill because impact work fails when scarce resources are not routed intelligently. This specific skill aligns reported confidence with actual uncertainty.

## When To Use
Use this skill when the request explicitly needs "Logistics Confidence Calibration Engine" outcomes in the Resource Allocation and Logistics domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Logistics Confidence Calibration Engine`, including at least three measurable KPIs tied to supply shortfalls and fairness gaps.
2. Design and version the input/output contract for capacity, bottlenecks, and distribution plans, then add schema validation and failure-mode handling.
3. Implement the core capability using calibration curves and error bins, and produce calibrated confidence scores with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover supply shortfalls and fairness gaps, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
