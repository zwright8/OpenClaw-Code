---
name: joint-laser-designator-code-and-sensor-fratricide-prevention-cell
description: Prevent laser-code conflicts and sensor fratricide during joint targeting. Use when JTACs, fires cells, UAS operators, or ISR teams need synchronized designation and release-safe cueing.
---

# Joint Laser Designator Code and Sensor Fratricide Prevention Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm authority, ROE, sensor mix, laser-code ownership, and release timeline before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Define the target-support problem, participating units, sensors, and timing windows.
2. Pull code assignments, designation geometry, and sensor cueing paths from the selected toolchain.
3. Build primary, alternate, and degraded deconfliction paths with explicit fratricide and no-strike triggers.
4. Bind recommendations to command approval, acknowledgment checks, and staff ownership.

## Required Output Format

1. Situation snapshot.
2. Recommended primary action path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking and suspense.

## Domain Products

Primary products: laser-code deconfliction matrix, sensor-safe fires window board, designation approval ladder.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-LASER-DESIGNATOR-FRATRICIDE-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-joint-laser-designator-sensor-fratricide-prevention-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `VMF`, `Link 16 J-series`, `USMTF`, and `API/JSON` for machine-to-machine exchanges.

## Guardrails

- Separate observed code assignments, assessed conflict risk, and unknowns.
- Flag stale sensor geometry, unacknowledged code changes, and single-source target confirmation.
- Keep human release authority explicit for any recommendation that changes fires timing or target validity.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-laser-designator-sensor-fratricide-prevention-v1` with `protocol_stack_id=ps-joint-laser-designator-sensor-fratricide-prevention-stack-v1`.
- Alternate: `tool_suite_id=ts-fires-airspace-v1` with `protocol_stack_id=ps-joint-tactical-link-stack-v1`.
- Degraded: authenticated voice readback, paper code card, and UTC acknowledgment log.

## Domain Packet Defaults

- Default packet ID: `DPL-LASER-DESIGNATOR-FRATRICIDE-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
