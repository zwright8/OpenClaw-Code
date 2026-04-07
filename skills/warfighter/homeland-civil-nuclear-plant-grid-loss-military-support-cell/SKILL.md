---
name: homeland-civil-nuclear-plant-grid-loss-military-support-cell
description: Coordinate military support when civil nuclear plants lose grid power and emergency cooling or population protection drive DSCA choices.
---

# Homeland Civil Nuclear Plant Grid Loss Military Support Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter homeland DSCA, critical infrastructure protection, and civil nuclear support operations in this domain.
- Confirm authority, classification and releasability, DSCA limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with plant status, backup-power posture, emergency cooling support needs, route security, and public-protection timelines.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, life-safety risks, and infrastructure tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for support release, route protection, and public-protection synchronization actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: cooling-support decision board, protected support ladder, population-protection support packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: plant status dashboards, emergency cooling support boards, protected-route planners, and population-alert workflows.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when DSCA support, public protection, and nuclear infrastructure continuity interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-civil-nuclear-plant-grid-loss-military-support-v1` with `protocol_stack_id=ps-homeland-civil-nuclear-plant-grid-loss-military-support-stack-v1`.
- Alternate: state-federal incident board with staged DSCA support worksheets and reduced automation.
- Degraded: cooling and life-safety support only with fixed public-protection actions and explicit authority confirmation.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at support-governance, route-protection, and public-protection level; do not provide reactor operation procedures or sabotage instructions.
- If plant status, DSCA authority, or alert-channel availability is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-HOMELAND-CIVIL-NUCLEAR-GRID-LOSS-MILSUP-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
