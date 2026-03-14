---
name: joint-urban-rubble-route-clearance-and-structural-collapse-rescue-cell
description: Support U.S. warfighter planning for urban rubble clearance, structural-collapse rescue, and lifesaving access restoration. Use when maneuver or rescue depends on rapidly opening routes without triggering secondary collapse.
---

# Joint Urban Rubble Route Clearance And Structural Collapse Rescue Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm collapse map, trapped-person reports, engineer capacity, and rescue authorities before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Build the current rubble, collapse, and route-access picture with engineer and rescue assets.
2. Identify which routes unlock the greatest lifesaving or maneuver advantage.
3. Build primary, alternate, and degraded clearance plans with explicit collapse-risk, utility-hazard, and rescue-delay tradeoffs.
4. Bind recommendations to rescue packets, route release gates, and revalidation triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended clearance and rescue path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, rescue actions, and suspense.

## Domain Products

Primary products: rubble clearance matrix, structural collapse rescue ladder, urban access priority board.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-URBAN-RUBBLE-RESCUE-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-joint-urban-rubble-route-clearance-structural-collapse-rescue-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `NIMS/ICS`, `OGC`, `CoT`, `USMTF`, and `API/JSON`.

## Guardrails

- Separate confirmed structural assessment, assumed survivable voids, and rumor reporting.
- Flag any route release that may trigger secondary collapse, utility ignition, or rescue fratricide.
- Keep human approval explicit for explosive breaching, demolition, or forced evacuation decisions.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-urban-rubble-route-clearance-structural-collapse-rescue-v1` with `protocol_stack_id=ps-joint-urban-rubble-route-clearance-structural-collapse-rescue-stack-v1`.
- Alternate: `tool_suite_id=ts-civil-support-v1` with `protocol_stack_id=ps-joint-urban-rubble-route-clearance-structural-collapse-rescue-stack-v1`.
- Degraded: lifesaving rescue corridors only with engineer and rescue dual approval plus manual route board.

## Domain Packet Defaults

- Default packet ID: `DPL-URBAN-RUBBLE-RESCUE-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
