---
name: joint-rail-air-sea-medical-evacuation-network-deconfliction-cell
description: Support joint medical operations with synchronized rail-air-sea evacuation network deconfliction, casualty flow balancing, and protected corridor assurance.
---

# Joint Rail Air Sea Medical Evacuation Network Deconfliction Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm echelon, authorities, timeline, and mission decision points before generating recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance.

## Workflow

1. Build a mission snapshot with current status, threat posture, support constraints, and commander priorities.
2. Define branch options with explicit tradeoffs in survivability, tempo, sustainment burden, and escalation risk.
3. Select external toolchain configuration (primary, alternate, degraded) and state the protocol/message path.
4. Map each tool output to a commander decision point with confidence, assumptions, and validation gates.
5. Produce commander-facing recommendations plus staff actions with owners, suspense, and branch triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternatives and trigger conditions.
4. Decision points and approval gates.
5. Staff tasking with suspense.

## Domain Tool Stack

Use these tool categories by default: medevac corridor schedulers, multimodal patient-flow balancing tools, and transport availability reconciliation systems.

## Protocol Profile

Preferred protocol families for this skill: USMTF, HL7/FHIR, STANAG, AIS, API/JSON.

## Domain Toolchain Defaults

- Primary: select a mission-fit tool_suite_id from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md.
- Alternate: select a cross-check tool_suite_id with independent data provenance.
- Degraded: commander-approved manual branch board with UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md to bind concrete tool suites and protocol stacks.
- Use ../_shared/references/domain-tool-packet-library.md and include packet_id=DPL-MULTIMODAL-MEDEVAC-DECONFLICTION-001 for critical recommendations.
- Include tool_suite_id, protocol_stack_id, packet_id, data freshness (UTC), confidence, and fallback path in each high-impact branch.
- If no direct packet match exists, define a provisional packet with validation_owner and revalidation_utc.

## Guardrails

- Separate facts, assessed judgments, assumptions, and unknowns.
- Flag legal/policy/ROE constraints and coalition interoperability limits early.
- Downgrade to advisory-only when authority, data provenance, or acknowledgment integrity is uncertain.
- Do not fabricate sources, approvals, or operational authorities.

## Domain Toolchain Override (2026-03-12, Expansion Wave XVIII Addendum)

- Add tool_suite_id=ts-multimodal-medevac-corridor-deconfliction-v1 + protocol_stack_id=ps-multimodal-medevac-corridor-deconfliction-stack-v1 when patient movement depends on synchronized rail, air, and sea lift under threat.\n- Add tool_suite_id=ts-casualty-load-balancing-and-bed-availability-fusion-v1 + protocol_stack_id=ps-casualty-load-balancing-and-bed-availability-fusion-stack-v1 when branch recommendations require balancing transport windows with treatment-capacity constraints.\n- Add packet_id=DPL-MULTIMODAL-MEDEVAC-DECONFLICTION-001 and packet_id=DPL-CASUALTY-BED-FUSION-001 for recommendations that alter medevac sequencing or protected-route allocation.
