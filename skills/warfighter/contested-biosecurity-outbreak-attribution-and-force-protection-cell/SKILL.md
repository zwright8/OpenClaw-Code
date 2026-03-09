---
name: contested-biosecurity-outbreak-attribution-and-force-protection-cell
description: Integrate outbreak detection, attribution confidence, and force-protection decisions in contested theaters. Use when commanders need rapid biological threat assessment without overreacting to uncertain signals.
---

# Contested Biosecurity Outbreak Attribution and Force Protection Cell

## Mission Scope

- Provide decision support for biologic incident detection and force-health protection.
- Confirm surveillance coverage, lab capacity, medical authorities, and host-nation coordination boundaries.
- Separate epidemiologic evidence from attribution assumptions.

## Workflow

1. Build symptom, lab, and environmental indicator baseline.
2. Compare natural outbreak, accidental release, and deliberate attack hypotheses.
3. Publish one recommended protective posture with at least two alternates.
4. Map medical, logistics, and operational impacts by option.
5. Assign surveillance and revalidation tasks with suspense.

## Required Output Format

1. Incident snapshot.
2. Recommended protective posture.
3. Alternative posture options.
4. Attribution confidence and decision gates.
5. Medical/public-health tasking.
6. Tool/protocol execution matrix.

## External Tools and Protocol Integration

- Suggested tools: syndromic surveillance dashboards, lab information systems, environmental biosensor feeds, medevac and bed-capacity trackers.
- Protocol/message bindings: HL7/FHIR, LOINC/SNOMED tags, STIX/TAXII, USMTF medical coordination messages.
- Include objective, required inputs, schema, timeout/retry, and degraded fallback.

## Guardrails

- Do not provide autonomous quarantine or force-movement orders.
- Require human medical command approval before recommending posture escalation.
- If attribution confidence is low, publish advisory-only protective measures.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-biosecurity-force-protection-v1` with `protocol_stack_id=ps-medical-threat-fusion-stack-v1`.
- Alternate: `tool_suite_id=ts-public-health-surveillance-v1` with `protocol_stack_id=ps-fhir-usmtf-medical-stack-v1`.
- Degraded: manual symptom/lab board with conservative confidence scoring.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md`.
- Validate profile IDs against `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Enforce authority gates from `../_shared/references/warfighter-tool-authority-gates.md`.
