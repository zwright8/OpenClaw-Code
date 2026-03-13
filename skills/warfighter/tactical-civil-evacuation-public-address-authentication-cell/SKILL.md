---
name: tactical-civil-evacuation-public-address-authentication-cell
description: Authenticate public-address and loudspeaker evacuation orders in contested urban operations.
---

# Tactical Civil Evacuation Public Address Authentication Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter civil protection, urban operations, and information-integrity missions in this domain.
- Confirm authority, classification and releasability, life-safety constraints, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with evacuation routes, message content, language requirements, threat indicators, and broadcast options.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, trust risks, and movement-control tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for message release, translation assurance, and rumor-control actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: message authenticity board, evacuation broadcast ladder, civil-trust packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: message-authentication workflows, translation assurance boards, civil-alert dissemination planners, and rumor-monitoring dashboards.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when public warning, translation fidelity, and movement control interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-tactical-civil-evacuation-public-address-auth-v1` with `protocol_stack_id=ps-tactical-civil-evacuation-public-address-auth-stack-v1`.
- Alternate: manual readback witness chain with fixed-script loudspeaker control and limited language sets.
- Degraded: life-safety broadcasts only with authenticated fixed phrases and local witness confirmation.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at public-protection, trust, and movement-governance level; do not produce disinformation operations or coercive population-control tactics.
- If message provenance, translation confidence, or broadcast integrity is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-TACTICAL-CIVIL-EVACUATION-PUBLIC-ADDRESS-AUTH-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
