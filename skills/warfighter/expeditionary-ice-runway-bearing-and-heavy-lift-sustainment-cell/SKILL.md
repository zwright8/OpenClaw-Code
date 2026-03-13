---
name: expeditionary-ice-runway-bearing-and-heavy-lift-sustainment-cell
description: Support U.S. warfighter planning and decision support for expeditionary ice runway bearing and heavy-lift sustainment. Use when missions require Arctic runway certification, heavy-airlift sequencing, and authority-gated staff outputs.
---

# Expeditionary Ice Runway Bearing And Heavy Lift Sustainment Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter Arctic air mobility and expeditionary sustainment operations in this domain.
- Confirm authority, classification and releasability, environmental restrictions, runway-bearing evidence, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with ice thickness and temperature trends, runway geometry, heavy-lift demand, weather windows, and ground-support availability.
2. Compare primary, alternate, and degraded sustainment branches with explicit trigger thresholds, runway-stress margins, and throughput tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for runway certification, slot allocation, and sustainment branch changes.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: ice runway bearing matrix, heavy-lift slot ladder, cold-weather sustainment packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: ice-thickness modeling tools, runway stress boards, Arctic weather feeds, and heavy-lift scheduling planners.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-ice-runway-bearing-heavy-lift-sustainment-v1` with `protocol_stack_id=ps-expeditionary-ice-runway-bearing-heavy-lift-sustainment-stack-v1`.
- Alternate: Arctic runway board with dual sounding verification and reduced-weight slot sequencing.
- Degraded: mission-essential airlift only with conservative runway classification and manual slot release.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at runway certification, heavy-lift sequencing, and sustainment-governance level; do not generate aircraft performance tables, approach procedures, or payload optimization details.
- If bearing evidence, weather confidence, or heavy-lift demand data is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-EXPEDITIONARY-ICE-RUNWAY-BEARING-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
