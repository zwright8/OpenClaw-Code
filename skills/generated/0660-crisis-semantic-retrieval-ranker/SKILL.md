---
name: u0660-crisis-semantic-retrieval-ranker
description: Build and operate the "Crisis Semantic Retrieval Ranker" capability for Crisis and Incident Response. Trigger when this exact capability is needed in mission execution.
---

# Crisis Semantic Retrieval Ranker

## Why This Skill Exists
We need this skill because response quality determines whether incidents are contained or amplified. This specific skill improves recall precision for downstream decision quality.

## When To Use
Use this skill when the request explicitly needs "Crisis Semantic Retrieval Ranker" outcomes in the Crisis and Incident Response domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Crisis Semantic Retrieval Ranker`, including at least three measurable KPIs tied to slow containment and repeated outages.
2. Design and version the input/output contract for incident timelines, response roles, and recovery artifacts, then add schema validation and failure-mode handling.
3. Implement the core capability using semantic relevance scoring, and produce ranked retrieval results with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover slow containment and repeated outages, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
