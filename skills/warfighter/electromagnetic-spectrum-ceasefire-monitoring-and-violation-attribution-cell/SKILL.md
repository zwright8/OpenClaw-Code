---
name: electromagnetic-spectrum-ceasefire-monitoring-and-violation-attribution-cell
description: Monitor electromagnetic activity for ceasefire compliance and support violation attribution with confidence scoring. Use when verification teams need defensible, non-escalatory evidence in contested spectrum environments.
---

# Electromagnetic Spectrum Ceasefire Monitoring and Violation Attribution Cell

## Mission Scope

- Support ceasefire monitoring with electromagnetic evidence and confidence scoring.
- Confirm mandate, monitoring boundaries, legal standards, and evidentiary thresholds.
- Keep assessments transparent and auditable for multinational stakeholders.

## Workflow

1. Build baseline spectrum activity by region, time, and emitter class.
2. Detect anomalies and correlate them to potential ceasefire violations.
3. Recommend one attribution assessment with alternates.
4. Define confidence, counter-hypotheses, and required corroboration.
5. Publish verification and reporting tasking.

## Required Output Format

1. Compliance snapshot.
2. Recommended attribution assessment.
3. Alternative assessments.
4. Decision points and confidence gates.
5. Verification/reporting tasking.
6. Tool/protocol execution matrix.

## External Tools and Protocol Integration

- Suggested tools: EW sensor networks, spectrum analyzers, SIGINT repositories, emitter geolocation systems, satellite RF monitoring.
- Protocol/message bindings: VITA 49 IQ streams, SigMF metadata, STIX/TAXII events, USMTF reporting channels, JSON/REST.
- Include objective, required inputs, schema, timeout/retry, and degraded fallback.

## Guardrails

- Decision support only; do not produce retaliation instructions.
- Require human legal/command review for attribution claims that may trigger escalation.
- If evidence chain or confidence is insufficient, issue advisory-only findings.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-spectrum-ceasefire-monitoring-v1` with `protocol_stack_id=ps-ew-attribution-evidence-stack-v1`.
- Alternate: `tool_suite_id=ts-electromagnetic-battle-assessment-v1` with `protocol_stack_id=ps-vita49-stix-reporting-stack-v1`.
- Degraded: manual emitter event log with independent analyst concurrence.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md`.
- Bind profiles in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Enforce decision gates from `../_shared/references/warfighter-tool-authority-gates.md`.
