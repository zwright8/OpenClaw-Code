---
name: strategic-domestic-transport-chokepoint-reroute-cell
description: Reroute domestic military movement when rail, bridge, port, or highway chokepoints are compromised.
---

# Strategic Domestic Transport Chokepoint Reroute Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter strategic mobility, homeland force flow, and domestic sustainment continuity operations in this domain.
- Confirm authority, classification and releasability, civil-military coordination limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with transportation outages, cargo priorities, modal capacity, route security, and deployment timelines.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, throughput risks, and reroute tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for modal shifts, convoy staging, and chokepoint bypass actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: chokepoint reroute board, modal transfer ladder, movement authority packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: national freight-flow boards, military shipment priority trackers, bridge and port status dashboards, and convoy reroute workflows.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when rail, highway, inland-waterway, and port dependencies interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-domestic-transport-chokepoint-reroute-v1` with `protocol_stack_id=ps-strategic-domestic-transport-chokepoint-reroute-stack-v1`.
- Alternate: manual movement control board with regional liaison reconciliation and phased modal transfer.
- Degraded: defense-critical movements only with modal rationing, convoy staging, and explicit delay acceptance.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at reroute governance, throughput management, and force-flow prioritization level; do not provide sabotage guidance or unsafe transportation bypass instructions.
- If infrastructure status, cargo priority, or authority data is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-STRATEGIC-DOMESTIC-TRANSPORT-CHOKEPOINT-REROUTE-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
