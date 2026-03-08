---
name: u0812-inclusion-human-approval-router
description: Build and operate the "Inclusion Human Approval Router" capability for Accessibility and Inclusion. Trigger when this exact capability is needed in mission execution.
---

# Inclusion Human Approval Router

## Why This Skill Exists
We need this skill because systems must be operable and understandable for diverse users. This specific skill directs high-risk decisions to the right humans quickly.

## When To Use
Use this skill when the request explicitly needs "Inclusion Human Approval Router" outcomes in the Accessibility and Inclusion domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Inclusion Human Approval Router`, including at least three measurable KPIs tied to barriers for disabled and underserved groups.
2. Design and version the input/output contract for accessibility audits, accommodations, and usability feedback, then add schema validation and failure-mode handling.
3. Implement the core capability using reviewer routing policies, and produce priority approval queues with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover barriers for disabled and underserved groups, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
