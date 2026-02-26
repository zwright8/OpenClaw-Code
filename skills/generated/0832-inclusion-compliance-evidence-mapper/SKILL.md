---
name: u0832-inclusion-compliance-evidence-mapper
description: Build and operate the "Inclusion Compliance Evidence Mapper" capability for Accessibility and Inclusion. Trigger when this exact capability is needed in mission execution.
---

# Inclusion Compliance Evidence Mapper

## Why This Skill Exists
We need this skill because systems must be operable and understandable for diverse users. This specific skill keeps proof of control coverage continuously current.

## When To Use
Use this skill when the request explicitly needs "Inclusion Compliance Evidence Mapper" outcomes in the Accessibility and Inclusion domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Inclusion Compliance Evidence Mapper`, including at least three measurable KPIs tied to barriers for disabled and underserved groups.
2. Design and version the input/output contract for accessibility audits, accommodations, and usability feedback, then add schema validation and failure-mode handling.
3. Implement the core capability using requirement-to-evidence mapping, and produce compliance evidence matrices with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover barriers for disabled and underserved groups, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Notes
- Core method: requirement-to-evidence mapping
- Archetype: normalization-engine
- Routing tag: accessibility-and-inclusion:normalization-engine

## Input Contract
- `accessibility audits` (signal, source=upstream, required=true)
- `accommodations` (signal, source=upstream, required=true)
- `usability feedback` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `compliance_evidence_matrices_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `compliance_evidence_matrices_scorecard` (scorecard, consumer=operator, guaranteed=true)

## Validation Gates
1. **schema-contract-check** — All required input signals present and schema-valid (on fail: quarantine)
2. **determinism-check** — Repeated run on same inputs yields stable scoring and artifacts (on fail: escalate)
3. **policy-approval-check** — Approval gates satisfied before publish-level outputs (on fail: retry)

## Failure Handling
- `E_INPUT_SCHEMA`: Missing or malformed required signals → Reject payload, emit validation error, request corrected payload
- `E_NON_DETERMINISM`: Determinism delta exceeds allowed threshold → Freeze output, escalate to human approval router
- `E_DEPENDENCY_TIMEOUT`: Downstream or external dependency timeout → Apply retry policy then rollback to last stable baseline
- Rollback strategy: rollback-to-last-stable-baseline

## Handoff Contract
- Produces: Inclusion Compliance Evidence Mapper normalized artifacts; execution scorecard; risk posture
- Consumes: accessibility audits; accommodations; usability feedback; claims; evidence; confidence traces
- Downstream routing hint: Route next to accessibility-and-inclusion:normalization-engine consumers with approval-gate context

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
