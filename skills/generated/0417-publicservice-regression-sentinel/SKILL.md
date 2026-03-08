---
name: u0417-publicservice-regression-sentinel
description: Build and operate the "PublicService Regression Sentinel" capability for Healthcare and Public Services. Trigger when this exact capability is needed in mission execution.
---

# PublicService Regression Sentinel

## Why This Skill Exists
We need this skill because public-facing workflows require strict safety and reliability controls. This specific skill prevents unnoticed quality drift after updates.

## When To Use
Use this skill when the request explicitly needs "PublicService Regression Sentinel" outcomes in the Healthcare and Public Services domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `PublicService Regression Sentinel`, including at least three measurable KPIs tied to service harm and procedural violations.
2. Design and version the input/output contract for protocol checks, service queues, and compliance flags, then add schema validation and failure-mode handling.
3. Implement the core capability using baseline-delta detection, and produce regression watchlists with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover service harm and procedural violations, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
