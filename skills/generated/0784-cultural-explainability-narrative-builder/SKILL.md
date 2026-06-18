---
name: u0784-cultural-explainability-narrative-builder
description: Build and operate the "Cultural Explainability Narrative Builder" capability for Multilingual and Cultural Adaptation. Trigger when this exact capability is needed in mission execution.
---

# Cultural Explainability Narrative Builder

## Why This Skill Exists
We need this skill because global utility requires language and cultural context fidelity. This specific skill translates technical decisions into operator-usable narratives.

## When To Use
Use this skill when the request explicitly needs "Cultural Explainability Narrative Builder" outcomes in the Multilingual and Cultural Adaptation domain.

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Cultural Explainability Narrative Builder`, including at least three measurable KPIs tied to context mismatch and exclusion.
2. Design and version the input/output contract for language variants, cultural norms, and local preferences, then add schema validation and failure-mode handling.
3. Implement the core capability using reason synthesis and abstraction, and produce decision narratives with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover context mismatch and exclusion, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Runtime profile: communication-engine using reason synthesis and abstraction to produce decision narratives.
- Orchestration integration: multilingual-and-cultural-adaptation:communication-engine routing, approval gates, retries, and rollback controls.
- Validation evidence: unit, integration, simulation, regression-baseline suites and rollout telemetry.

## Operational Runbook
### Preflight
- Confirm the Cultural Explainability Narrative Builder request scope, source evidence, and measurable success criteria before execution.
- Verify feature flag skill_0784_cultural-explainability-narrativ, approval gates, and rollback owner before autonomous use.

### Execution
- Execute reason synthesis and abstraction with deterministic scoring and reproducible trace capture.
- Produce decision narratives plus scorecard, assumptions, and unresolved-risk notes.

### Recovery
- Fail closed when required signals, evidence, or approval gates are missing.
- Rollback to the last stable baseline when posture is critical or validation fails.

### Handoff
- Publish decision narratives, validation evidence, and telemetry links to downstream owners.
- Queue follow-up tasks for unresolved risks, threshold tuning, or approval review.

## Guardrails
- [quality] Require deterministic scoring and validation evidence before promotion.
- [reliability] Preserve retries, rollback controls, and failure-mode evidence for every run.
- [safety] Route critical posture or missing approval gates to human review before autonomous action.
