---
name: coalition-fuel-energy-water-nexus-anomaly-adjudication-cell
description: Support coalition warfighter planning for fuel-energy-water anomaly adjudication across critical bases, ports, hospitals, and sustainment nodes. Use when utility disruption may be sabotage, cyber-physical failure, or cascading logistics breakdown.
---

# Coalition Fuel Energy Water Nexus Anomaly Adjudication Cell

## Mission Scope

- Treat this skill as planning and decision support for coalition warfighter operations.
- Confirm affected nodes, coalition authorities, utility telemetry availability, and life-safety deadlines before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Establish the current fuel, power, and water picture with timeline and node dependencies.
2. Identify whether anomalies point to physical failure, cyber-physical interference, or sustainment shortfall.
3. Build primary, alternate, and degraded response paths with explicit restoration, rationing, and reroute triggers.
4. Bind recommendations to coalition utility packets, acknowledgment checks, and revalidation deadlines.

## Required Output Format

1. Situation snapshot.
2. Recommended FEW adjudication path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, restoration actions, and suspense.

## Domain Products

Primary products: FEW anomaly adjudication packet, coalition utility restoration ladder, cascading-risk map.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-FEW-NEXUS-ANOMALY-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-coalition-fuel-energy-water-nexus-anomaly-adjudication-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `NIMS/ICS`, `OGC`, `API/JSON`, `USMTF`, and `NIEM`.

## Guardrails

- Separate confirmed telemetry, inferred cascade effects, and unknowns.
- Flag any plan that trades away hospital, water-treatment, or command-node survivability without explicit approval.
- Keep human approval explicit for coalition utility reallocation, protective isolation, or forced load shedding.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-fuel-energy-water-nexus-anomaly-adjudication-v1` with `protocol_stack_id=ps-coalition-fuel-energy-water-nexus-anomaly-adjudication-stack-v1`.
- Alternate: `tool_suite_id=ts-civil-support-v1` with `protocol_stack_id=ps-coalition-fuel-energy-water-nexus-anomaly-adjudication-stack-v1`.
- Degraded: life-safety utilities only with manual status confirmation every 4 hours and coalition liaison ledger.

## Domain Packet Defaults

- Default packet ID: `DPL-FEW-NEXUS-ANOMALY-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
