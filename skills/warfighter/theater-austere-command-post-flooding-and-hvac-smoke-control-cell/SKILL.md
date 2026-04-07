---
name: theater-austere-command-post-flooding-and-hvac-smoke-control-cell
description: Keep austere command posts operational when flooding, smoke, or HVAC failure threaten battle-rhythm continuity.
---

# Theater Austere Command Post Flooding And HVAC Smoke Control Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter command-post survivability, mission continuity, and environmental-control recovery operations in this domain.
- Confirm authority, classification and releasability, facility-safety limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with water-ingress alerts, smoke status, HVAC health, mission-node criticality, and relocation options.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, battle-rhythm risks, and survivability tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for isolation actions, node relocation, and environmental recovery.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: command-post survivability board, flood-smoke control ladder, mission continuity packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: facility sensor dashboards, water-ingress workflows, HVAC isolation boards, and mission-node relocation planners.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when facility survivability, mission continuity, and relocation branches interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-austere-command-post-flooding-hvac-smoke-control-v1` with `protocol_stack_id=ps-theater-austere-command-post-flooding-hvac-smoke-control-stack-v1`.
- Alternate: manual facilities watch board with battle-rhythm fragmentation recovery sheet and partial node relocation.
- Degraded: essential C2 nodes only with environmental watches, local air monitoring, and manual message routing.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at survivability-governance, relocation, and safety level; do not provide sabotage methods, hazardous control bypass instructions, or unsafe occupancy recommendations.
- If sensor data, facility status, or relocation evidence is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-THEATER-AUSTERE-COMMAND-POST-FLOOD-SMOKE-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
