---
name: joint-civil-nuclear-plant-grid-islanding-population-protection-cell
description: Coordinate civil nuclear plant grid-islanding, emergency cooling continuity, and population protection messaging under crisis conditions.
---

# Joint Civil Nuclear Plant Grid Islanding Population Protection Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations in this domain.
- Confirm authority, classification/releasability, coalition sharing limits, and required commander decisions.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with threat indicators, critical dependencies, and timing constraints.
2. Compare primary, alternate, and degraded branches with explicit triggers and uncertainty notes.
3. Bind each branch to concrete tool/protocol integrations and validation owners.
4. Publish commander decision points, staff tasking, and revalidation windows.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate/degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions (owner, suspense, and verification method).

## Domain Products

Primary products: nuclear islanding decision matrix, cooling continuity ladder, population protection packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite/stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-civil-nuclear-plant-grid-islanding-population-protection-v1` with `protocol_stack_id=ps-joint-civil-nuclear-plant-grid-islanding-population-protection-stack-v1`.
- Alternate: `tool_suite_id=ts-joint-c2-fusion-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: authenticated voice/text branch with UTC event logs, cross-check witness, and delayed machine reconciliation.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- If tool trust, authority, or data freshness is below threshold, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet IDs: `DPL-JOINT-CIVIL-NUCLEAR-PLANT-GRID-ISLANDING-POPULATION-PROTECTION-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
