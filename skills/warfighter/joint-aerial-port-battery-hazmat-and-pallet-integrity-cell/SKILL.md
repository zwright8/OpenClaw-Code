---
name: joint-aerial-port-battery-hazmat-and-pallet-integrity-cell
description: Support U.S. warfighter planning for aerial-port battery, hazmat, and pallet-integrity control. Use when sortie flow depends on safe cargo release, load discipline, and fast exception handling for hazardous consignments.
---

# Joint Aerial Port Battery Hazmat And Pallet Integrity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm cargo urgency, aircraft mix, hazmat rules, and loadmaster or aircrew constraints before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Build the cargo picture with manifest data, battery classes, hazmat declarations, and pallet geometry.
2. Identify unsafe loads, missing certifications, and the highest-impact sortie bottlenecks.
3. Build primary, alternate, and degraded cargo-release plans with explicit fire-risk, delay, and throughput tradeoffs.
4. Bind recommendations to cargo packets, inspection gates, and release authority.

## Required Output Format

1. Situation snapshot.
2. Recommended cargo-release path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, inspections, and suspense.

## Domain Products

Primary products: cargo release matrix, hazmat exception ladder, pallet integrity risk board.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-AERIAL-PORT-HAZMAT-PALLET-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-joint-aerial-port-battery-hazmat-pallet-integrity-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer signed cargo manifests, `AIXM/FIXM`, `API/JSON`, `USMTF`, and `NATO APP-11/ADatP-3` aligned exchange.

## Guardrails

- Separate confirmed certifications, assumed packaging state, and unresolved hazards.
- Flag any load that exceeds aircraft safety, ramp-fire response, or pallet stability limits.
- Keep human approval explicit for hazardous-cargo waivers or last-minute load redistribution.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-aerial-port-battery-hazmat-pallet-integrity-v1` with `protocol_stack_id=ps-joint-aerial-port-battery-hazmat-pallet-integrity-stack-v1`.
- Alternate: `tool_suite_id=ts-logistics-distribution-v1` with `protocol_stack_id=ps-joint-aerial-port-battery-hazmat-pallet-integrity-stack-v1`.
- Degraded: mission-essential cargo only with manual pallet inspection, fire watch, and single-sortie release approval.

## Domain Packet Defaults

- Default packet ID: `DPL-AERIAL-PORT-HAZMAT-PALLET-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
