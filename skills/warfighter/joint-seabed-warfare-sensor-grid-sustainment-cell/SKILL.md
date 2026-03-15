---
name: joint-seabed-warfare-sensor-grid-sustainment-cell
description: Sustain and reconstitute seabed sensing grids for U.S. and allied maritime awareness under sabotage, jamming, and repair constraints. Use when undersea surveillance continuity and chokepoint warning timelines are mission critical.
---

# Joint Seabed Warfare Sensor Grid Sustainment Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm authority, data classification, response timeline, and engagement constraints.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Establish mission objective, constraints, and commander decision horizon.
2. Fuse tool outputs into confidence-ranked options with explicit assumptions.
3. Build primary, alternate, and degraded courses of action with trigger conditions.
4. Bind each recommendation to authority gates, acknowledgments, and staff ownership.

## Required Output Format

1. Situation snapshot.
2. Recommended primary action path.
3. Alternate/degraded path.
4. Decision points and authorities.
5. Staff tasking and suspense.

## Domain Products

Primary products: mission posture summary, risk-to-mission matrix, execution branch plan.

## External Tools and Protocol Integration

- Use ../_shared/references/external-tools-protocols.md and ../_shared/references/tool-protocol-playbooks.md.
- Use packet template DPL-SEABED-GRID-001 from ../_shared/references/domain-tool-packet-library.md.
- Bind tool and protocol choices to ts-seabed-grid-sustainment-v1 from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md.
- Include transport/profile mapping and UTC freshness in all machine-to-machine exchanges.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Flag single-source claims and require corroboration for high-impact recommendations.
- Keep human command approval checkpoints explicit for lethal or strategically escalatory actions.

## Domain Toolchain Defaults

- Primary: tool_suite_id=ts-seabed-grid-sustainment-v1 with protocol_stack_id=ps-joint-tactical-link-stack-v1.
- Alternate: tool_suite_id=ts-intel-fusion-v1 with protocol_stack_id=ps-cop-event-sharing-stack-v1.
- Degraded: authenticated text or voice reporting with UTC acknowledgment chain.

## Domain Packet Defaults

- Default packet ID: DPL-SEABED-GRID-001.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner/suspense.
