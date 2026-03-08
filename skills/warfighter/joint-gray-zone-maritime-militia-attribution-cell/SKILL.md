---
name: joint-gray-zone-maritime-militia-attribution-cell
description: Attribute gray-zone maritime militia activity using legal-grade evidence and escalation-bounded response options. Use when ambiguous maritime coercion threatens U.S. or partner interests and attribution confidence drives action.
---

# Joint Gray-Zone Maritime Militia Attribution Cell

## Mission Scope

- Provide attribution-focused decision support for U.S. and coalition maritime operations.
- Confirm jurisdiction, authorities, evidence handling constraints, and escalation boundaries.
- Keep products releasable by default with clear caveats.

## Workflow

1. Aggregate vessel behavior, ownership, and pattern-of-life indicators.
2. Build confidence-ranked attribution hypotheses and legal evidence chains.
3. Present bounded response options linked to confidence thresholds.
4. Define revalidation triggers and branch criteria.

## Required Output Format

1. Situation snapshot.
2. Recommended attribution assessment.
3. Alternative hypotheses and confidence deltas.
4. Legal/policy decision points.
5. Staff tasking with evidence custodians.

## Domain Products

Primary products: militia attribution packet, evidence chain log, escalation-bounded response ladder.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/joint-mission-data-contracts.md`.
- Use packet template `DPL-GRAY-MAR-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind recommendations to `ts-gray-zone-maritime-attribution-v1` in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Include protocol mappings (for example `AIS/NMEA`, `API/JSON`, `USMTF`) and provenance timestamps.

## Guardrails

- Preserve chain-of-custody integrity for all attribution evidence.
- Distinguish legal findings from intelligence estimates.
- Elevate uncertain attribution to advisory-only posture.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-gray-zone-maritime-attribution-v1` with `protocol_stack_id=ps-maritime-awareness-stack-v1`.
- Alternate: `tool_suite_id=ts-maritime-undersea-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: manual vessel pattern board with scheduled legal review cycle.

## Domain Packet Defaults

- Default packet ID: `DPL-GRAY-MAR-001`.
- If evidence authority is incomplete, publish provisional packet with `validation_owner` and `revalidation_utc`.
