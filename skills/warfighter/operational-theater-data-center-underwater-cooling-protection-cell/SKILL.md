---
name: operational-theater-data-center-underwater-cooling-protection-cell
description: Preserve theater data-center cooling and compute continuity when underwater intake or heat-rejection systems are disrupted. Use when digital C2 survivability depends on maritime-adjacent infrastructure resilience.
---

# Operational Theater Data Center Underwater Cooling Protection Cell

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
- Use packet template DPL-DC-UNDERWATER-COOLING-001 from ../_shared/references/domain-tool-packet-library.md.
- Bind tool and protocol choices to ts-underwater-cooling-protection-v1 from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md.
- Include transport/profile mapping and UTC freshness in all machine-to-machine exchanges.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Flag single-source claims and require corroboration for high-impact recommendations.
- Keep human command approval checkpoints explicit for lethal or strategically escalatory actions.

## Domain Toolchain Defaults

- Primary: tool_suite_id=ts-underwater-cooling-protection-v1 with protocol_stack_id=ps-joint-tactical-link-stack-v1.
- Alternate: tool_suite_id=ts-intel-fusion-v1 with protocol_stack_id=ps-cop-event-sharing-stack-v1.
- Degraded: authenticated text or voice reporting with UTC acknowledgment chain.

## Domain Packet Defaults

- Default packet ID: DPL-DC-UNDERWATER-COOLING-001.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner/suspense.
