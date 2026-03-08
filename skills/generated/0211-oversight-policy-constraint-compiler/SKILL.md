---
name: u0211-oversight-policy-constraint-compiler
description: Build and operate the "Oversight Policy Constraint Compiler" capability for Human Oversight and Operator UX. Trigger when this exact capability is needed in mission execution.
---

# Oversight Policy Constraint Compiler

## Why This Skill Exists
We need this skill because human teams need fast, legible control when stakes are high. This specific skill turns governance language into enforceable runtime checks.

## When To Use
Use this skill when the request explicitly needs "Oversight Policy Constraint Compiler" outcomes in the Human Oversight and Operator UX domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Oversight Policy Constraint Compiler`, including at least three measurable KPIs tied to slow interventions and approval bottlenecks.
2. Design and version the input/output contract for approval queues, operator workload, and intervention history, then add schema validation and failure-mode handling.
3. Implement the core capability using rule compilation, and produce executable policy bundles with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover slow interventions and approval bottlenecks, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
