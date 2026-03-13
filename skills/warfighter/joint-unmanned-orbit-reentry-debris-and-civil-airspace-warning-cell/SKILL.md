---
name: joint-unmanned-orbit-reentry-debris-and-civil-airspace-warning-cell
description: Support U.S. warfighter planning and decision support for unmanned orbit reentry debris and civil airspace warning. Use when missions require reentry risk adjudication, warning synchronization, and authority-gated staff outputs.
---

# Joint Unmanned Orbit Reentry Debris And Civil Airspace Warning Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter space-ground integration and civil-airspace risk operations in this domain.
- Confirm authority, classification and releasability, civil-airspace coordination limits, reentry-confidence bounds, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with orbital track quality, reentry timing confidence, debris footprint predictions, civil-airspace usage, and warning-channel readiness.
2. Compare primary, alternate, and degraded warning branches with explicit trigger thresholds, airspace-risk assumptions, and public-safety tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for warning release, airspace restrictions, and debris-response actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: reentry risk board, airspace warning ladder, debris response packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: orbital event trackers, debris footprint modelers, civil-airspace warning workflows, and protected-asset risk boards.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-unmanned-orbit-reentry-debris-civil-airspace-warning-v1` with `protocol_stack_id=ps-joint-unmanned-orbit-reentry-debris-civil-airspace-warning-stack-v1`.
- Alternate: orbital warning board with conservative debris corridor assumptions and staged civil-notice release.
- Degraded: life-safety warnings only with manual ephemeris reconciliation and fixed airspace restrictions.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at warning, airspace coordination, and debris-response governance level; do not generate anti-satellite actions, destructive counterspace tactics, or targetable reentry exploitation details.
- If orbital confidence, footprint modeling, or civil-airspace coordination status is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-JOINT-UNMANNED-ORBIT-REENTRY-DEBRIS-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
