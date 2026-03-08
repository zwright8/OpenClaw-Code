---
name: u0774-cultural-tool-health-monitor
description: Build and operate the "Cultural Tool Health Monitor" capability for Multilingual and Cultural Adaptation. Trigger when this exact capability is needed in mission execution.
---

# Cultural Tool Health Monitor

## Why This Skill Exists
We need this skill because global utility requires language and cultural context fidelity. This specific skill detects tool flakiness before it impacts mission outcomes.

## When To Use
Use this skill when the request explicitly needs "Cultural Tool Health Monitor" outcomes in the Multilingual and Cultural Adaptation domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Cultural Tool Health Monitor`, including at least three measurable KPIs tied to context mismatch and exclusion.
2. Design and version the input/output contract for language variants, cultural norms, and local preferences, then add schema validation and failure-mode handling.
3. Implement the core capability using telemetry aggregation and SLO checks, and produce tool reliability scores with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover context mismatch and exclusion, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
