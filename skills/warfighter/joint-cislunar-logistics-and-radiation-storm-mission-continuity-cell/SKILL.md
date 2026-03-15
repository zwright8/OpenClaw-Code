---
name: joint-cislunar-logistics-and-radiation-storm-mission-continuity-cell
description: Coordinate cislunar logistics continuity when radiation storms degrade sensing, comms, and timing confidence. Use when force posture depends on synchronized orbital logistics decisions under severe space-weather disruption.
---

# Joint Cislunar Logistics and Radiation Storm Mission Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm authority, classification, orbital asset ownership, and decision timeline.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build a cislunar mission picture: logistics nodes, transfer windows, and exposure timelines.
2. Compare continuity branches for comms, timing, and maneuver constraints during radiation events.
3. Select primary, alternate, and degraded exchange paths with explicit trigger thresholds.
4. Publish commander decision points, staff tasking, and revalidation windows.

## Required Output Format

1. Situation snapshot.
2. Recommended continuity branch.
3. Alternate/degraded branches.
4. Decision authorities and timing gates.
5. Staff actions and suspense.

## Domain Products

Primary products: cislunar continuity matrix, radiation-storm trigger ledger, logistics reroute packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Map critical dependencies to a packet in `../_shared/references/domain-tool-packet-library.md` (or define a provisional packet).
- Bind every recommendation to concrete suite/stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-space-satcom-v1` with `protocol_stack_id=ps-cislunar-radiation-storm-response-stack-v1`.
- Alternate: `tool_suite_id=ts-nc3-resilience-v1` with `protocol_stack_id=ps-space-ground-failover-stack-v1`.
- Degraded: authenticated UTC voice ledger with delayed machine reconciliation.

## Guardrails

- Separate observed telemetry, assessed confidence, and unknowns.
- If timing integrity cannot be confirmed, mark recommendations `provisional`.
- Escalate strategic-impact decisions through `../_shared/references/human-agent-command-escalation-matrix.md`.

## Domain Packet Defaults

- Default packet IDs: `DPL-SPACE-C2-LINK-001`, `DPL-C2-DISP-002`, `DPL-TIME-INTEGRITY-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for all mission-critical tool exchanges before recommending posture changes.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate the alternate stack and mark outputs `provisional`.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
