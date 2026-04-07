---
name: joint-cislunar-timing-trust-and-collision-risk-mitigation-cell
description: Mitigate cislunar collision risk when degraded timing trust undermines custody, maneuver, and conjunction decisions.
---

# Joint Cislunar Timing Trust And Collision Risk Mitigation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter cislunar logistics, custody assurance, and maneuver safety operations in this domain.
- Confirm authority, classification and releasability, timing-trust thresholds, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with ephemeris status, timing confidence, custody gaps, planned maneuvers, and conjunction warnings.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, separation risks, and custody tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for maneuver holds, timing recovery, and collision-avoidance actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: timing-trust board, conjunction ladder, maneuver approval packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: cislunar ephemeris ledgers, timing-integrity boards, conjunction assessment workflows, and maneuver approval trackers.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when timing trust, custody confidence, and maneuver release branches interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-cislunar-timing-trust-collision-mitigation-v1` with `protocol_stack_id=ps-joint-cislunar-timing-trust-collision-mitigation-stack-v1`.
- Alternate: manual ephemeris reconciliation cell with conservative keep-out buffers and maneuver holds.
- Degraded: essential custody maneuvers only with expanded separation and dual approval.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at timing-trust, conjunction-governance, and maneuver-approval level; do not provide offensive counterspace, jamming, or unsafe orbital interference instructions.
- If timing confidence, custody evidence, or ephemeris quality is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-JOINT-CISLUNAR-TIMING-COLLISION-MITIGATION-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
