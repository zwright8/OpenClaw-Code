---
name: coalition-host-nation-5g-outage-and-tactical-backhaul-restoration-cell
description: Support U.S. warfighter planning and decision support for coalition host-nation 5G outage response and tactical backhaul restoration. Use when missions require telecom continuity, coalition releasability checks, and authority-gated staff outputs.
---

# Coalition Host-Nation 5G Outage And Tactical Backhaul Restoration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter coalition telecom and mission-network continuity operations in this domain.
- Confirm authority, classification and releasability, coalition caveats, host-nation telecom permissions, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with outage scope, spectrum constraints, fiber and microwave path status, coalition caveats, and mission-thread dependency maps.
2. Compare primary, alternate, and degraded restoration branches with explicit trigger thresholds, release assumptions, and timing risks.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for backhaul restoration, network reroute, and coalition acknowledgment actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: backhaul restoration board, coverage-gap matrix, coalition telecom release packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: host-nation cellular outage maps, tactical backhaul planners, coalition caveat ledgers, and network trust-health dashboards.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-host-nation-5g-backhaul-restoration-v1` with `protocol_stack_id=ps-coalition-host-nation-5g-backhaul-restoration-stack-v1`.
- Alternate: coalition network operations board with line-of-sight relay fallback and staged caveat reconciliation.
- Degraded: mission-essential links only with voice-confirmed reroute matrix and timed link-health polling.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at telecom continuity, coalition release, and backhaul restoration governance level; do not produce intrusion guidance, exploit chains, or offensive cyber instructions.
- If outage attribution, coalition permissions, or trust-health telemetry is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-COALITION-HOST-NATION-5G-BACKHAUL-RESTORATION-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
