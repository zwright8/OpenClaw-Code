---
name: theater-digital-terrain-fabric-spoof-detection-and-route-approval-cell
description: Detect spoofed digital terrain products and re-approve routes before maneuver forces commit.
---

# Theater Digital Terrain Fabric Spoof Detection And Route Approval Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter geospatial integrity, route clearance, and maneuver assurance operations in this domain.
- Confirm authority, classification and releasability, maneuver risk thresholds, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with terrain sources, provenance gaps, route nominations, engineer reports, and threat indicators.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, mobility risks, and route-trust tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for map quarantine, route re-approval, and movement release actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: terrain integrity board, route approval ladder, maneuver release packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: terrain provenance ledgers, geospatial anomaly detectors, route-clearance workflows, and engineer mobility trackers.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when geospatial trust, route release, and engineer validation branches interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-digital-terrain-fabric-spoof-route-approval-v1` with `protocol_stack_id=ps-theater-digital-terrain-fabric-spoof-route-approval-stack-v1`.
- Alternate: manual map and survey reconciliation board with route-by-route engineer approval.
- Degraded: mission-essential movement only with conservative speed and load restrictions plus visual navigation cross-checks.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at terrain-integrity, route-governance, and movement-release level; do not provide geospatial tampering techniques, deception methods, or bypass instructions.
- If terrain provenance, survey validation, or threat evidence is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-THEATER-DIGITAL-TERRAIN-SPOOF-ROUTE-APPROVAL-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
