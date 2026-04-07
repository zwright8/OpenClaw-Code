---
name: expeditionary-aircraft-arresting-gear-and-crash-barrier-restoration-cell
description: Restore expeditionary runway arresting gear and crash barriers to recover sortie generation.
---

# Expeditionary Aircraft Arresting Gear And Crash Barrier Restoration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter expeditionary airbase recovery, flight safety, and sortie-generation operations in this domain.
- Confirm authority, classification and releasability, airfield safety limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with arresting-gear status, barrier damage, runway inspection results, aircraft demand, and repair capacity.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, flight-safety risks, and sortie-tempo tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for runway release, aircraft-type restrictions, and barrier repair actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: barrier restoration board, runway release ladder, sortie recovery packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: arresting-gear status dashboards, barrier repair workflows, runway inspection boards, and sortie sequencing planners.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when runway integrity, aircraft demand, and barrier restoration branches interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-aircraft-arresting-gear-crash-barrier-restoration-v1` with `protocol_stack_id=ps-expeditionary-aircraft-arresting-gear-crash-barrier-restoration-stack-v1`.
- Alternate: manual airfield safety board with single-runway release and reduced-weight restrictions.
- Degraded: emergency recoveries only with arresting gear offline, explicit aircraft-type limits, and commander risk acceptance.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at repair-governance, runway-release, and flight-safety level; do not provide unsafe maintenance actions, explosive-system bypass methods, or hazardous emergency techniques.
- If runway status, barrier integrity, or aircraft demand data is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-EXPEDITIONARY-AIRCRAFT-ARRESTING-GEAR-CRASH-BARRIER-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
