---
name: strategic-shipyard-drydock-power-water-and-cyber-restoration-cell
description: Restore drydock operations when utility outages or cyber compromise threaten naval repair throughput.
---

# Strategic Shipyard Drydock Power Water And Cyber Restoration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter naval industrial-base restoration, drydock safety, and fleet repair throughput operations in this domain.
- Confirm authority, classification and releasability, shipyard safety limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with utility outages, drydock status, cyber alerts, repair priorities, and workforce constraints.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, repair-throughput risks, and safety tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for utility restoration, dock release, and repair reprioritization actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: drydock restoration board, utility recovery ladder, repair release packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: shipyard utility dashboards, drydock availability boards, OT incident workflows, and repair priority planners.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when utility continuity, cyber trust, and fleet repair branches interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-shipyard-drydock-power-water-cyber-restoration-v1` with `protocol_stack_id=ps-strategic-shipyard-drydock-power-water-cyber-restoration-stack-v1`.
- Alternate: manual shipyard control board with dock-by-dock utility release and reduced repair tempo.
- Degraded: nuclear or combat-critical repairs only with manual safety watches and commander-approved throughput loss.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at utility-restoration, dock-release, and repair-priority level; do not provide cyber persistence methods, unsafe OT manipulation, or hazardous drydock procedures.
- If utility status, cyber integrity, or repair-priority data is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-STRATEGIC-SHIPYARD-DRYDOCK-RESTORATION-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
