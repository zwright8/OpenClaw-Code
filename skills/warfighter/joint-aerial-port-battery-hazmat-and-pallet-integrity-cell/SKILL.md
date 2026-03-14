---
name: joint-aerial-port-battery-hazmat-and-pallet-integrity-cell
description: Support U.S. warfighter planning for aerial-port battery, hazmat, and pallet integrity when sortie release depends on safe cargo acceptance, fire-risk control, and pallet-build discipline.
---

# Joint Aerial Port Battery Hazmat And Pallet Integrity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm airfield authority, aircraft constraints, hazmat rules, and sortie deadlines before recommending cargo release actions.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Establish the cargo manifest, battery classes, hazmat declarations, pallet geometry, and aircraft assignments.
2. Identify loads that threaten flight safety, ramp safety, or sortie timing if released without correction.
3. Build primary, alternate, and degraded release paths with explicit throughput, fire-risk, and waiver tradeoffs.
4. Bind recommendations to cargo packets, loadmaster approvals, and pallet reinspection triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended cargo-release path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, load actions, and revalidation triggers.

## Domain Products

Primary products: cargo release matrix, hazmat exception ladder, pallet integrity risk board.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-AERIAL-PORT-HAZMAT-PALLET-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-joint-aerial-port-battery-hazmat-pallet-integrity-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer signed cargo manifests, `AIXM/FIXM`, `API/JSON`, `USMTF`, and `NATO APP-11/ADatP-3` aligned exchange.

## Guardrails

- Separate certified cargo data, suspected declaration mismatches, and unknown load-state gaps.
- Flag any plan that outruns fire-response posture, aircrew safety limits, or host-nation hazmat restrictions.
- Keep human approval explicit for hazmat waivers, mixed-load acceptance, or single-sortie overload relief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-aerial-port-battery-hazmat-pallet-integrity-v1` with `protocol_stack_id=ps-joint-aerial-port-battery-hazmat-pallet-integrity-stack-v1`.
- Alternate: `tool_suite_id=ts-logistics-distribution-v1` with `protocol_stack_id=ps-joint-aerial-port-battery-hazmat-pallet-integrity-stack-v1`.
- Degraded: mission-essential cargo only with heightened fire-watch and single-sortie load approval.

## Domain Packet Defaults

- Default packet ID: `DPL-AERIAL-PORT-HAZMAT-PALLET-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
