---
name: homeland-base-fuel-hydrant-and-fire-suppression-recovery-cell
description: Restore hydrant fuel loops, foam reserves, and fire-suppression systems after cyber-physical disruption or attack. Use when sortie generation or base survivability depends on safe fueling and fire control.
---

# Homeland Base Fuel Hydrant and Fire Suppression Recovery Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm base authority, affected infrastructure, sortie demand, and fire-code constraints before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Define the infrastructure failure, affected hydrant loops, and sortie or life-safety priorities.
2. Pull pressure telemetry, isolation state, foam inventory, and repair dependencies from the selected toolchain.
3. Build primary, alternate, and degraded restoration paths with explicit fueling and fire-watch triggers.
4. Bind recommendations to emergency-management approvals, safety checks, and staff ownership.

## Required Output Format

1. Situation snapshot.
2. Recommended primary action path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking and suspense.

## Domain Products

Primary products: hydrant restoration matrix, foam reserve ladder, sortie fueling risk board.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-BASE-FUEL-HYDRANT-FIRE-SUPPRESSION-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-homeland-base-fuel-hydrant-fire-suppression-recovery-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `NIMS/ICS`, `OPC UA`, `API/JSON`, and `USMTF` for machine-to-machine exchanges.

## Guardrails

- Separate observed infrastructure state, assessed restoration confidence, and unknowns.
- Flag unverified pressure readings, incomplete isolation, and any plan that bypasses fire or environmental safety controls.
- Keep human approval explicit before returning hydrant service or reducing fire watch.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-base-fuel-hydrant-fire-suppression-recovery-v1` with `protocol_stack_id=ps-homeland-base-fuel-hydrant-fire-suppression-recovery-stack-v1`.
- Alternate: `tool_suite_id=ts-civil-support-v1` with `protocol_stack_id=ps-priority-of-life-routing-stack-v1`.
- Degraded: truck fueling only with manual isolation, fire watch, and UTC release log.

## Domain Packet Defaults

- Default packet ID: `DPL-BASE-FUEL-HYDRANT-FIRE-SUPPRESSION-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
