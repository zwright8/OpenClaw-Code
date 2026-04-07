---
name: joint-ballistic-missile-raid-shelter-capacity-and-population-protection-cell
description: Support U.S. warfighter planning and decision support for ballistic missile raid shelter capacity, warning synchronization, and population protection. Use when missions require raid warning fusion, shelter allocation, and authority-gated staff outputs.
---

# Joint Ballistic Missile Raid Shelter Capacity And Population Protection Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter air and missile defense plus civil-protection operations in this domain.
- Confirm authority, classification and releasability, warning dissemination authorities, shelter accountability assumptions, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with missile warning confidence, defended-asset posture, shelter capacity, population density, movement constraints, and alert-channel availability.
2. Compare primary, alternate, and degraded protection branches with explicit trigger thresholds, warning windows, and uncertainty notes.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for sheltering, movement-control, and life-safety warning actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: missile raid shelter decision board, population protection ladder, protected movement packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: missile warning boards, shelter occupancy dashboards, protected movement planners, and civil-alert dissemination workflows.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-ballistic-missile-raid-shelter-population-protection-v1` with `protocol_stack_id=ps-joint-ballistic-missile-raid-shelter-population-protection-stack-v1`.
- Alternate: independent warning and shelter board with authenticated alert confirmations and manual capacity reconciliation.
- Degraded: paper shelter roster, UTC warning readback log, and fixed protective-action ladder.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at warning, shelter, and population-protection governance level; do not generate interceptor employment, target selection, or strike-execution instructions.
- If warning confidence, shelter accountability, or alert-channel status is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-JOINT-BALLISTIC-MISSILE-RAID-SHELTER-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
