---
name: joint-urban-rubble-route-clearance-and-structural-collapse-rescue-cell
description: Support U.S. warfighter planning for urban rubble route clearance and structural-collapse rescue when engineer capacity must be balanced between lifesaving rescue and maneuver access.
---

# Joint Urban Rubble Route Clearance And Structural Collapse Rescue Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm rescue authority, engineer capacity, civilian-harm constraints, and route priorities before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Establish the collapse map, trapped-person reports, blocked routes, utility hazards, and available engineer assets.
2. Identify lifesaving corridors, secondary-collapse risk, and the routes that unlock the most rescue or maneuver value.
3. Build primary, alternate, and degraded clearance paths with explicit rescue, safety, and access tradeoffs.
4. Bind recommendations to rescue packets, route-release authorities, and dual-approval checkpoints.

## Required Output Format

1. Situation snapshot.
2. Recommended clearance and rescue path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, route actions, and revalidation triggers.

## Domain Products

Primary products: rubble clearance matrix, structural collapse rescue ladder, urban access priority board.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-URBAN-RUBBLE-RESCUE-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-joint-urban-rubble-route-clearance-structural-collapse-rescue-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `NIMS/ICS`, `OGC`, `CoT`, `USMTF`, and `API/JSON`.

## Guardrails

- Separate confirmed entrapment data, assessed collapse risk, and unknown void conditions.
- Flag any plan that outruns structural safety, utility isolation, or civilian deconfliction requirements.
- Keep human approval explicit for high-risk breaching, rescue-corridor release, or engineer-priority shifts.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-urban-rubble-route-clearance-structural-collapse-rescue-v1` with `protocol_stack_id=ps-joint-urban-rubble-route-clearance-structural-collapse-rescue-stack-v1`.
- Alternate: `tool_suite_id=ts-civil-support-v1` with `protocol_stack_id=ps-joint-urban-rubble-route-clearance-structural-collapse-rescue-stack-v1`.
- Degraded: lifesaving rescue corridors only with engineer and rescue dual approval.

## Domain Packet Defaults

- Default packet ID: `DPL-URBAN-RUBBLE-RESCUE-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
