---
name: expeditionary-helicopter-brownout-and-drone-deconfliction-cell
description: Protect expeditionary rotary-wing landings by combining brownout risk, UAS conflict, and landing-zone release control.
---

# Expeditionary Helicopter Brownout And Drone Deconfliction Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter rotary-wing, casualty evacuation, and expeditionary airfield operations in this domain.
- Confirm authority, classification and releasability, aviation safety limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with landing-zone conditions, brownout forecasts, UAS tracks, sortie demand, and safety minima.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, visibility risks, and timing tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for LZ release, drone separation, and sortie sequencing actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: landing-zone hazard board, arrival-departure ladder, aviation safety packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: dust and visibility hazard models, landing-zone surveillance boards, UAS separation workflows, and sortie timing planners.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when rotary-wing safety, low-altitude UAS traffic, and weather limits interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-helicopter-brownout-drone-deconfliction-v1` with `protocol_stack_id=ps-expeditionary-helicopter-brownout-drone-deconfliction-stack-v1`.
- Alternate: manual LZ safety board with fixed drone exclusion windows and reduced sortie tempo.
- Degraded: casualty or mission-essential movements only with conservative visibility minimums and explicit aviation approval.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at airspace safety, LZ release, and sortie-governance level; do not provide attack aviation tactics or kinetic engagement procedures.
- If visibility confidence, UAS separation data, or LZ surveillance is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-EXPEDITIONARY-HELICOPTER-BROWNOUT-DRONE-DECONFLICTION-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
