---
name: u0937-infra-regression-sentinel
description: Build and operate the "Infra Regression Sentinel" capability for Infrastructure and Sustainability. Trigger when this exact capability is needed in mission execution.
---

# Infra Regression Sentinel

## Why This Skill Exists
We need this skill because long-term scale depends on resilient and sustainable infrastructure choices. This specific skill prevents unnoticed quality drift after updates.

## When To Use
Use this skill when the request explicitly needs "Infra Regression Sentinel" outcomes in the Infrastructure and Sustainability domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Infra Regression Sentinel`, including at least three measurable KPIs tied to capacity collapse and environmental debt.
2. Design and version the input/output contract for capacity forecasts, energy usage, and sustainability metrics, then add schema validation and failure-mode handling.
3. Implement the core capability using baseline-delta detection, and produce regression watchlists with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover capacity collapse and environmental debt, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
