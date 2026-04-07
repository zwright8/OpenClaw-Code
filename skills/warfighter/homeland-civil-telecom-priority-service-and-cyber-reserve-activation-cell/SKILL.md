---
name: homeland-civil-telecom-priority-service-and-cyber-reserve-activation-cell
description: Support U.S. warfighter planning and decision support for homeland civil telecom priority-service activation and cyber reserve mobilization. Use when missions require emergency telecom continuity, reserve-force call-up synchronization, and authority-gated staff outputs.
---

# Homeland Civil Telecom Priority Service And Cyber Reserve Activation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter homeland civil-support and cyber-continuity operations in this domain.
- Confirm authority, classification and releasability, emergency-support statutes, telecom-provider dependencies, reserve activation authorities, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with telecom outage scope, priority-service eligibility, emergency services load, reserve-force availability, and cyber incident status.
2. Compare primary, alternate, and degraded continuity branches with explicit trigger thresholds, statutory constraints, and service-restoration risks.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for priority-service activation, cyber reserve mobilization, and emergency routing actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: telecom priority-service activation board, cyber reserve call-up ladder, emergency-routing packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: telecom priority-service portals, cyber reserve roster trackers, outage-impact dashboards, and public-safety routing workflows.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-civil-telecom-priority-cyber-reserve-activation-v1` with `protocol_stack_id=ps-homeland-civil-telecom-priority-cyber-reserve-activation-stack-v1`.
- Alternate: civil-emergency board with manual priority-service queueing and reserve notification ladder.
- Degraded: life-safety circuits only with voice call tree, paper reserve roster, and UTC event log.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at telecom continuity, reserve mobilization, and emergency-routing governance level; do not produce offensive cyber actions, social engineering steps, or surveillance instructions.
- If statutory authority, provider status, or reserve availability data is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-HOMELAND-CIVIL-TELECOM-PRIORITY-CYBER-RESERVE-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
