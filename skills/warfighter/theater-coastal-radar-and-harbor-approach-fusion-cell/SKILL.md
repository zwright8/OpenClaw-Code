---
name: theater-coastal-radar-and-harbor-approach-fusion-cell
description: Support U.S. warfighter planning and decision support for coastal radar fusion, harbor-approach threat screening, and low-slow track confidence. Use when missions require port-approach surveillance, small-craft and low-altitude track adjudication, and authority-gated staff outputs.
---

# Theater Coastal Radar And Harbor Approach Fusion Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter port and coastal-defense operations in this domain.
- Confirm authority, classification and releasability, port-authority coordination limits, air and maritime track-sharing rules, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with coastal radar coverage, AIS and small-craft baselines, harbor approach geometry, low-altitude or low-slow track uncertainty, and port-security posture.
2. Compare primary, alternate, and degraded branches with explicit triggers, false-alarm thresholds, and branch invalidators.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for screening posture, pilotage controls, and harbor approach response.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: harbor-approach surveillance confidence board, low-slow track adjudication matrix, port-screening escalation packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: coastal radar services, AIS analytics, shoreline EO or IR watch systems, port security sensor fusion boards, and geospatial harbor overlays.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-coastal-radar-harbor-approach-fusion-v1` with `protocol_stack_id=ps-theater-coastal-radar-harbor-approach-fusion-stack-v1`.
- Alternate: `tool_suite_id=ts-maritime-undersea-v1` with `protocol_stack_id=ps-geo-maritime-stack-v1`.
- Degraded: harbor watch bill, manual small-craft and low-altitude track ledger, and fixed approach-risk windows with UTC updates.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at surveillance, screening, and alert-posture level; do not generate direct engagement instructions.
- If track provenance, port-authority coordination, or approach safety status is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet IDs: `DPL-COASTAL-RADAR-HARBOR-APPROACH-001`, `DPL-UNDERSEA-BARRIER-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
