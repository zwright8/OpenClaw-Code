---
name: u0201-oversight-signal-ingestion-normalizer
description: Build and operate the "Oversight Signal Ingestion Normalizer" capability for Human Oversight and Operator UX. Use only when production execution explicitly requires this exact capability and output contract.
---

# Oversight Signal Ingestion Normalizer

## Why This Skill Exists
We need this skill because human teams need fast, legible control when stakes are high. This specific skill stabilizes noisy upstream inputs before they contaminate planning.

## Production Trigger Criteria
- Trigger only when the requested outcome explicitly maps to **Oversight Signal Ingestion Normalizer** in the **Human Oversight and Operator UX** capability family.
- Require a named production consumer and execution window before running (no exploratory/ad-hoc execution).
- Require complete upstream signals; if any required signal is absent, stop and return a remediation request (fail closed).

## Step-by-Step Implementation Guide
1. Define the scope and success metrics for `Oversight Signal Ingestion Normalizer`, including at least three measurable KPIs tied to slow interventions and approval bottlenecks.
2. Design and version the input/output contract for approval queues, operator workload, and intervention history, then add schema validation and failure-mode handling.
3. Implement the core capability using schema mapping and validation, and produce normalized signal feeds with deterministic scoring.
4. Integrate the skill into swarm orchestration: task routing, approval gates, retry strategy, and rollback controls.
5. Add unit, integration, and simulation tests that explicitly cover slow interventions and approval bottlenecks, then run regression baselines.
6. Deploy behind a feature flag, monitor telemetry/alerts for two release cycles, and iterate thresholds based on observed outcomes.

## Deterministic Workflow Constraints
- Core method: schema mapping and validation
- Archetype: normalization-engine
- Routing tag: human-oversight-and-operator-ux:normalization-engine
- Determinism tolerance: repeated runs on identical normalized inputs must keep score/output delta within **<= 0.5%**.
- Retry budget: max 4 attempts with exponential backoff; then rollback.

## Input Contract
- `approval queues` (signal, source=upstream, required=true)
- `operator workload` (signal, source=upstream, required=true)
- `intervention history` (signal, source=upstream, required=true)
- `claims` (signal, source=upstream, required=true)
- `evidence` (signal, source=upstream, required=true)
- `confidence traces` (signal, source=upstream, required=true)

## Output Contract
- `normalized_signal_feeds_report` (structured-report, consumer=orchestrator, guaranteed=true)
- `normalized_signal_feeds_scorecard` (scorecard, consumer=operator, guaranteed=true)

## Validation Gates (Fail-Closed)
1. **schema-contract-check** — Reject execution unless all required inputs are present and schema-valid (on fail: quarantine + remediation request).
2. **determinism-check** — Re-run fixed test vector; block publish-level output if variance exceeds 0.5% (on fail: escalate + hold).
3. **policy-approval-check** — Enforce policy gates before any publish-level artifact (on fail: block).
4. **high-risk-human-signoff** — If risk >= critical threshold or policy marks high-impact, require explicit human approval before release (on fail: block).

## Failure Handling
- `E_INPUT_SCHEMA`: Missing or malformed required signals → Reject payload, emit validation error, request corrected payload
- `E_NON_DETERMINISM`: Determinism delta exceeds allowed threshold → Freeze output, escalate to human approval router
- `E_DEPENDENCY_TIMEOUT`: Downstream or external dependency timeout → Apply retry policy then rollback to last stable baseline
- Rollback strategy: rollback-to-last-stable-baseline

## Handoff Contract
- Produces: Oversight Signal Ingestion Normalizer normalized artifacts; execution scorecard; risk posture
- Consumes: approval queues; operator workload; intervention history; claims; evidence; confidence traces
- Downstream routing hint: Route next to human-oversight-and-operator-ux:normalization-engine consumers with approval-gate context

## Immediate Hardening Additions (Required Before Promotion)
- Add/refresh fixture file: `fixtures/golden-input.json` with deterministic sample payload and expected checksum.
- Add/refresh regression case: `tests/regression-case.md` for highest-risk failure path and expected fail-closed behavior.
- Emit machine-readable run summary to `hardening-summary.json` with fields: `status`, `risk_score`, `confidence`, `next_handoff`, `human_signoff_required`.
- Do not emit publish-level outputs when any validation gate fails.
