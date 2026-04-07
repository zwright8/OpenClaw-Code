---
name: theater-rapid-temporary-bridge-uas-inspection-and-release-cell
description: Use UAS inspection and engineer verification to rapidly release temporary bridges for military movement.
---

# Theater Rapid Temporary Bridge UAS Inspection And Release Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter engineer mobility, route-release, and theater sustainment operations in this domain.
- Confirm authority, classification and releasability, engineer safety limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with bridge imagery, span configuration, defect cues, route priorities, and load demands.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, structural risks, and force-flow tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for inspection, load release, and mobility-corridor actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: bridge inspection matrix, load-release ladder, mobility packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: UAS inspection planners, structural defect triage boards, bridge load-class workflows, and mobility release trackers.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when engineer release, UAS sensing, and route capacity interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-rapid-temporary-bridge-uas-inspection-release-v1` with `protocol_stack_id=ps-theater-rapid-temporary-bridge-uas-inspection-release-stack-v1`.
- Alternate: engineer release board with manual defect triage and conservative load tables.
- Degraded: life-safety or mission-essential crossings only with restrictive load classes and manual engineer concurrence.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at engineer release, mobility governance, and structural safety level; do not provide demolition, sabotage, or weaponization guidance.
- If imagery confidence, structural assessment, or route-capacity data is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-THEATER-TEMPORARY-BRIDGE-UAS-RELEASE-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
