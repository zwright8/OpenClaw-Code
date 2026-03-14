---
name: joint-orbital-mission-data-downlink-window-and-ground-priority-cell
description: Support U.S. warfighter planning for orbital mission-data downlink windows and ground-station priority when scarce passes must be allocated to the products that change commander decisions fastest.
---

# Joint Orbital Mission Data Downlink Window And Ground Priority Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm mission priorities, pass schedules, ground-station constraints, and release deadlines before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Establish the current orbital pass schedule, ground-station availability, data volumes, and latency requirements.
2. Identify which products lose the most operational value when deferred and which passes are genuinely scarce.
3. Build primary, alternate, and degraded downlink paths with explicit latency, custody, and opportunity-cost tradeoffs.
4. Bind recommendations to downlink packets, pass acknowledgments, and post-pass redistribution triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended downlink-priority path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, pass actions, and revalidation triggers.

## Domain Products

Primary products: downlink priority board, ground-pass allocation ladder, delayed-product risk matrix.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-ORBITAL-DOWNLINK-PRIORITY-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-joint-orbital-mission-data-downlink-window-ground-priority-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `CCSDS`, signed telemetry manifests, `API/JSON`, and `USMTF`.

## Guardrails

- Separate confirmed pass availability, predicted link quality, and unknown latency impacts.
- Flag any plan that strands time-sensitive warning or targeting products behind low-priority bulk traffic.
- Keep human approval explicit for pass preemption, ground-station reprioritization, or product-class deferral.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-orbital-mission-data-downlink-window-ground-priority-v1` with `protocol_stack_id=ps-joint-orbital-mission-data-downlink-window-ground-priority-stack-v1`.
- Alternate: `tool_suite_id=ts-space-satcom-v1` with `protocol_stack_id=ps-joint-orbital-mission-data-downlink-window-ground-priority-stack-v1`.
- Degraded: one mission-essential product class per pass with deferred bulk downloads and manual priority review.

## Domain Packet Defaults

- Default packet ID: `DPL-ORBITAL-DOWNLINK-PRIORITY-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
