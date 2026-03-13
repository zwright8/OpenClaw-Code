---
name: strategic-civil-reserve-air-fleet-activation-and-aeromedical-surge-cell
description: Support U.S. warfighter planning and decision support for Civil Reserve Air Fleet activation, civilian carrier integration, and aeromedical surge. Use when missions require contested strategic airlift options, patient movement synchronization, and authority-gated staff outputs.
---

# Strategic Civil Reserve Air Fleet Activation And Aeromedical Surge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter strategic-lift operations in this domain.
- Confirm authority, classification and releasability, patient privacy constraints, civil-carrier commitments, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with lift demand, patient movement requirements, carrier availability, diplomatic clearance posture, and threat or weather constraints.
2. Compare primary, alternate, and degraded airbridge branches with explicit triggers, bottlenecks, and confidence notes.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for airlift, aeromedical, and clearance actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: CRAF activation decision board, civil-carrier allocation and diplomatic-clearance matrix, aeromedical surge lane packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: strategic airlift allocation boards, patient movement requirement trackers, civil-carrier availability services, diplomatic-clearance workflows, and mission-weather status feeds.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-civil-reserve-air-fleet-aeromedical-surge-v1` with `protocol_stack_id=ps-strategic-civil-reserve-air-fleet-aeromedical-surge-stack-v1`.
- Alternate: `tool_suite_id=ts-logistics-distribution-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: commander-approved manual airbridge board with UTC readback log, dual manifest reconciliation, and delayed digital sync.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at allocation, routing-governance, and patient-movement assurance level; do not produce platform-specific flight-path evasion or execution tactics.
- If legal authorities, privacy controls, patient movement approvals, or diplomatic clearances are stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet IDs: `DPL-CRAF-AEROMED-SURGE-001`, `DPL-STRATEGIC-MOBILITY-CHOKEPOINT-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
