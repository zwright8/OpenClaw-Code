---
name: joint-orbital-mission-data-downlink-window-and-ground-priority-cell
description: Support U.S. warfighter planning for orbital mission-data downlink prioritization and ground-station arbitration. Use when scarce passes or ground time must be reserved for the data that changes commander decisions first.
---

# Joint Orbital Mission Data Downlink Window And Ground Priority Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm orbital pass schedule, ground-station health, mission priorities, and product latency thresholds before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Build the current pass, downlink, and ground-station picture with contention windows.
2. Identify which payloads, collections, or products have the highest decision urgency.
3. Build primary, alternate, and degraded downlink plans with explicit queueing, delay, and loss tradeoffs.
4. Bind recommendations to downlink packets, ground-station acknowledgments, and revalidation triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended downlink-priority path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, pass allocations, and suspense.

## Domain Products

Primary products: downlink priority board, ground-pass allocation ladder, delayed-product risk matrix.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-ORBITAL-DOWNLINK-PRIORITY-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-joint-orbital-mission-data-downlink-window-ground-priority-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `CCSDS`, signed telemetry manifests, `API/JSON`, and `USMTF`.

## Guardrails

- Separate confirmed pass availability, estimated delays, and speculative collection value.
- Flag any plan that drops warning, targeting, or survivability products below commander thresholds without approval.
- Keep human approval explicit for reprioritizing scarce ground-station time across theaters or missions.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-orbital-mission-data-downlink-window-ground-priority-v1` with `protocol_stack_id=ps-joint-orbital-mission-data-downlink-window-ground-priority-stack-v1`.
- Alternate: `tool_suite_id=ts-space-satcom-v1` with `protocol_stack_id=ps-joint-orbital-mission-data-downlink-window-ground-priority-stack-v1`.
- Degraded: one mission-essential product class per pass with delayed bulk download and UTC pass log.

## Domain Packet Defaults

- Default packet ID: `DPL-ORBITAL-DOWNLINK-PRIORITY-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
