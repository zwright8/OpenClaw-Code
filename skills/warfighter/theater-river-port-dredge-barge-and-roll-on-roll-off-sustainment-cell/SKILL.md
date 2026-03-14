---
name: theater-river-port-dredge-barge-and-roll-on-roll-off-sustainment-cell
description: Sustain inland maneuver and logistics through dredging, barge flow, and roll-on-roll-off release at river ports.
---

# Theater River Port Dredge Barge And Roll-On Roll-Off Sustainment Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter inland-waterway sustainment, river-port operations, and force-flow continuity in this domain.
- Confirm authority, classification and releasability, harbor-safety limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with channel depth, dredge status, barge queues, ramp condition, and cargo priorities.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, throughput risks, and river-port tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for channel release, barge allocation, and transload actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: channel clearance board, barge flow ladder, river-port sustainment packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: hydrographic survey boards, dredge scheduling workflows, barge queue trackers, and roll-on roll-off release planners.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when channel depth, cargo priority, and inland-waterway route branches interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-river-port-dredge-barge-roro-sustainment-v1` with `protocol_stack_id=ps-theater-river-port-dredge-barge-roro-sustainment-stack-v1`.
- Alternate: manual harbormaster board with daylight-only barge windows and reduced transload tempo.
- Degraded: mission-essential cargo only with draft limits, strict queue control, and commander-approved delay acceptance.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at channel-release, cargo-priority, and sustainment-governance level; do not provide unsafe navigation actions, dredging hazards, or sabotage guidance.
- If channel surveys, barge status, or cargo-priority data is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-THEATER-RIVER-PORT-DREDGE-BARGE-RORO-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
