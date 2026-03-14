---
name: coalition-shore-power-frequency-conversion-and-berthing-cell
description: Align berth assignment, shore-power compatibility, and frequency-conversion capacity for coalition ships in constrained ports. Use when allied ships need electrical support without losing port throughput or interoperability.
---

# Coalition Shore Power Frequency Conversion and Berthing Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm berth authority, coalition caveats, electrical compatibility rules, and port throughput priorities before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Define the berth and shore-power problem, ships affected, and time-sensitive sustainment requirements.
2. Pull converter status, berth availability, power quality, and coalition compatibility data from the selected toolchain.
3. Build primary, alternate, and degraded berthing or power paths with explicit overload and disconnect triggers.
4. Bind recommendations to harbor authority approval, coalition acknowledgment checks, and staff ownership.

## Required Output Format

1. Situation snapshot.
2. Recommended primary action path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking and suspense.

## Domain Products

Primary products: berth power allocation board, converter compatibility matrix, coalition port-risk ladder.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-SHORE-POWER-BERTHING-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-coalition-shore-power-frequency-conversion-berthing-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `AIS/NMEA`, power-cert manifests, `API/JSON`, `USMTF`, and NATO APP-11/ADatP-3 aligned exchanges.

## Guardrails

- Separate observed berth and power state, assessed compatibility confidence, and unknowns.
- Flag unverified converter ratings, missing coalition caveats, and any plan that overloads pier infrastructure.
- Keep human approval explicit before energizing shore power or changing coalition berth sequence.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-shore-power-frequency-conversion-berthing-v1` with `protocol_stack_id=ps-coalition-shore-power-frequency-conversion-berthing-stack-v1`.
- Alternate: `tool_suite_id=ts-maritime-undersea-v1` with `protocol_stack_id=ps-maritime-chokepoint-closure-stack-v1`.
- Degraded: shipboard generators only with prioritized berths and manual harbor-master coordination.

## Domain Packet Defaults

- Default packet ID: `DPL-SHORE-POWER-BERTHING-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
