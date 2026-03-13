---
name: theater-integrated-air-and-missile-defense-magazine-redistribution-cell
description: Support U.S. warfighter planning and decision support for theater integrated air and missile defense magazine redistribution. Use when missions require defended-asset reprioritization, reload routing, and authority-gated staff outputs.
---

# Theater Integrated Air And Missile Defense Magazine Redistribution Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter theater air and missile defense sustainment operations in this domain.
- Confirm authority, classification and releasability, defended-asset priorities, magazine accountability, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with magazine depth, defended-asset priority, threat raid density, transport availability, and reload site readiness.
2. Compare primary, alternate, and degraded redistribution branches with explicit trigger thresholds, depletion risks, and timing assumptions.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for magazine release, transport, and defended-asset reprioritization actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: defended-asset priority board, magazine redistribution ladder, reload-risk packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: magazine-depth dashboards, threat-raid forecasters, reload scheduling boards, and defended-asset priority workflows.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-iamd-magazine-redistribution-v1` with `protocol_stack_id=ps-theater-iamd-magazine-redistribution-stack-v1`.
- Alternate: defended-asset board with manual depletion reconciliation and conservative reload release timing.
- Degraded: high-priority defended assets only with fixed magazine holdback and manual acknowledgment chain.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at defended-asset governance, redistribution, and sustainment-risk level; do not generate firing solutions, engagement orders, or weapons-employment parameters.
- If magazine accountability, raid forecast confidence, or transport status is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-THEATER-IAMD-MAGAZINE-REDISTRIBUTION-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
