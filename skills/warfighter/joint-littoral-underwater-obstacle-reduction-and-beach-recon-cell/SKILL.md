---
name: joint-littoral-underwater-obstacle-reduction-and-beach-recon-cell
description: Support U.S. warfighter planning and decision support for littoral underwater obstacle reduction, beach reconnaissance, and lane-release assurance. Use when missions require amphibious approach-lane confidence, surf-zone hydrography checks, and authority-gated staff outputs.
---

# Joint Littoral Underwater Obstacle Reduction And Beach Recon Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter littoral and amphibious operations in this domain.
- Confirm authority, classification and releasability, mine and obstacle reporting limits, supporting-fires assumptions, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with beach and surf hydrography, underwater obstacle reports, mine or decoy risk, reconnaissance coverage, and lane-release criteria.
2. Compare primary, alternate, and degraded branches with explicit branch triggers, confidence notes, and invalidators.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for beach recon, lane release, and follow-on shore-entry actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: beach-lane clearance matrix, underwater obstacle confidence board, recon-to-release packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: hydrographic survey services, UUV mission planners, beachmaster and shore-party control boards, mine and obstacle cueing services, and geospatial shoreline overlays.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-littoral-underwater-obstacle-reduction-beach-recon-v1` with `protocol_stack_id=ps-joint-littoral-underwater-obstacle-reduction-beach-recon-stack-v1`.
- Alternate: `tool_suite_id=ts-amphibious-shore-entry-control-v1` with `protocol_stack_id=ps-geo-maritime-stack-v1`.
- Degraded: beachmaster manual lane board, timed hydrographic report cycle, and UTC acknowledgment log for recon changes.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at obstacle-prioritization, recon assurance, and lane-release governance level; do not generate breaching-charge formulas or assault-execution instructions.
- If hydrographic confidence, obstacle identity, or lane-release authority is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet IDs: `DPL-LITTORAL-BEACH-OBSTACLE-001`, `DPL-UNDERSEA-BARRIER-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
