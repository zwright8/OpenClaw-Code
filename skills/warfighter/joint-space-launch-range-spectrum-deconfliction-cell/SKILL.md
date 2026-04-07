---
name: joint-space-launch-range-spectrum-deconfliction-cell
description: Deconflict launch-range spectrum, telemetry integrity, and mission timing for military and dual-use space operations.
---

# Joint Space Launch Range Spectrum Deconfliction Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter launch-range governance, space mission assurance, and electromagnetic coordination in this domain.
- Confirm authority, classification and releasability, range-safety limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with launch manifests, telemetry requirements, spectrum occupancy, interference cues, and range timelines.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, telemetry risks, and launch-window tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for spectrum release, window adjudication, and interference response actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: spectrum release board, launch-window ladder, telemetry assurance packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: range-spectrum schedulers, telemetry health boards, launch-window adjudicators, and interference monitoring workflows.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when launch-range, telemetry, and spectrum priorities interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-space-launch-range-spectrum-deconfliction-v1` with `protocol_stack_id=ps-joint-space-launch-range-spectrum-deconfliction-stack-v1`.
- Alternate: range-control board with fixed spectrum hold windows and reduced telemetry routing.
- Degraded: highest-priority launches only with additional release gates and manual range-safety concurrence.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at range-governance, telemetry assurance, and spectrum deconfliction level; do not provide offensive space-control or sabotage guidance.
- If telemetry integrity, spectrum occupancy, or range-safety data is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-JOINT-SPACE-LAUNCH-RANGE-SPECTRUM-DECONFLICTION-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
