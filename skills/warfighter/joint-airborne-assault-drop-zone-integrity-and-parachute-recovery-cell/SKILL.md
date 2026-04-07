---
name: joint-airborne-assault-drop-zone-integrity-and-parachute-recovery-cell
description: Support U.S. warfighter planning and decision support for airborne assault drop-zone integrity, jump-window assurance, and parachute or bundle recovery. Use when missions require drop-zone certification, contested weather and obstacle checks, and authority-gated staff outputs.
---

# Joint Airborne Assault Drop-Zone Integrity And Parachute Recovery Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter airborne-entry operations in this domain.
- Confirm authority, classification and releasability, airspace coordination limits, ground-force linkup assumptions, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with drop-zone survey status, weather and surface winds, obstacle and threat overlays, airspace coordination, and recovery-force readiness.
2. Compare primary, alternate, and degraded airborne-entry branches with explicit trigger thresholds, uncertainty notes, and branch invalidators.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for jump, recovery, and follow-on resupply actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: drop-zone integrity board, jump-window risk matrix, parachute and bundle recovery packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: drop-zone survey apps, airborne weather feeds, obstacle and terrain assessment tools, jump manifest trackers, and blue-force recovery coordination boards.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-airborne-drop-zone-integrity-parachute-recovery-v1` with `protocol_stack_id=ps-joint-airborne-drop-zone-integrity-parachute-recovery-stack-v1`.
- Alternate: `tool_suite_id=ts-autonomous-airdrop-drift-control-v1` with `protocol_stack_id=ps-autonomous-airdrop-drift-control-stack-v1`.
- Degraded: manual DZ survey card, authenticated observer check-ins, and paper jump-manifest reconciliation with UTC event logging.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at drop-zone governance, survey confidence, and recovery synchronization level; do not generate jump-run geometry, weapons employment, or assault-execution instructions.
- If DZ survey status, weather minima, or airspace deconfliction is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet IDs: `DPL-AIRBORNE-DROPZONE-INTEGRITY-001`, `DPL-LOGISTICS-AIRDROP-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
