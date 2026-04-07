---
name: joint-battlefield-weather-radar-and-spectrum-deconfliction-cell
description: Deconflict battlefield weather-radar operations, electromagnetic attack plans, and trusted mission-weather dissemination.
---

# Joint Battlefield Weather Radar And Spectrum Deconfliction Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter joint weather, airspace, and electromagnetic operations in this domain.
- Confirm authority, classification and releasability, emission-control limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with radar status, weather-product dependencies, emission plans, airspace timing, and EW constraints.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, weather integrity risks, and interference tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for radar release, emissions control, and mission-weather updates.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: radar-spectrum separation matrix, weather integrity ladder, emissions-governance packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: spectrum assignment boards, weather-radar operations pictures, mission-weather product workflows, and electromagnetic emissions planners.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when weather, airspace, and electromagnetic branches interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-weather-radar-spectrum-deconfliction-v1` with `protocol_stack_id=ps-joint-weather-radar-spectrum-deconfliction-stack-v1`.
- Alternate: manual emissions board with reduced weather-update cycle and fixed radar windows.
- Degraded: mission-essential weather products only with conservative emission controls and explicit commander acknowledgment.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at emissions governance, airspace safety, and weather dissemination level; do not produce electronic-attack execution instructions or weapons-employment guidance.
- If radar health, spectrum conflict data, or airspace coordination is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-JOINT-WEATHER-RADAR-SPECTRUM-DECONFLICTION-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
