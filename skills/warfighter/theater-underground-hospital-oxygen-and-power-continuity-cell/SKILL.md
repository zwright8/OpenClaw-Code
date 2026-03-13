---
name: theater-underground-hospital-oxygen-and-power-continuity-cell
description: Sustain underground or protected hospital oxygen, power, and casualty flow under attack or infrastructure loss.
---

# Theater Underground Hospital Oxygen And Power Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter protected medical care, hospital continuity, and casualty-management operations in this domain.
- Confirm authority, classification and releasability, clinical safety limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with oxygen status, power profile, casualty load, generator health, and protective posture.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, survivability risks, and care-capacity tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for utility continuity, load shedding, and casualty-flow actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: oxygen-power continuity board, clinical load ladder, subterranean care packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: hospital utility dashboards, oxygen generation boards, critical-load planners, and casualty-flow trackers.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when medical care, utility continuity, and protected-facility survivability interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-underground-hospital-oxygen-power-continuity-v1` with `protocol_stack_id=ps-theater-underground-hospital-oxygen-power-continuity-stack-v1`.
- Alternate: hospital utility board with reduced-care-area worksheets and staged generator load control.
- Degraded: life-saving wards only with strict oxygen rationing, load shedding, and explicit medical-command approval.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at medical survivability, utility continuity, and casualty-flow governance level; do not provide invasive care procedures or triage-by-targeting instructions.
- If utility telemetry, oxygen status, or bed-capacity confidence is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-THEATER-UNDERGROUND-HOSPITAL-OXYGEN-POWER-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
