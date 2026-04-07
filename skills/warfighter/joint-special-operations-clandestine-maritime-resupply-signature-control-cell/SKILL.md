---
name: joint-special-operations-clandestine-maritime-resupply-signature-control-cell
description: Support U.S. warfighter planning and decision support for special operations clandestine maritime resupply and signature control. Use when missions require low-signature littoral sustainment, custody-assured handoffs, and authority-gated staff outputs.
---

# Joint Special Operations Clandestine Maritime Resupply Signature Control Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter special operations sustainment and maritime signature-management operations in this domain.
- Confirm authority, classification and releasability, special-access constraints, maritime deconfliction limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with resupply demand, coastal surveillance threat, littoral route options, custody requirements, and comms-window constraints.
2. Compare primary, alternate, and degraded resupply branches with explicit trigger thresholds, exposure risks, and handoff assumptions.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for launch timing, signature discipline, and custody-handoff actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: clandestine resupply signature board, littoral window ladder, custody-handoff packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: low-signature maritime route boards, coastal surveillance risk tools, cargo custody ledgers, and special operations comms-window planners.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-sof-clandestine-maritime-resupply-signature-control-v1` with `protocol_stack_id=ps-joint-sof-clandestine-maritime-resupply-signature-control-stack-v1`.
- Alternate: low-signature logistics board with conservative littoral windowing and manual custody witness.
- Degraded: mission-essential resupply only with voice confirmation, paper custody log, and fixed exposure windows.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at sustainment, route-governance, and custody-assurance level; do not generate infiltration tactics, evasion instructions, or targetable route execution details.
- If route confidence, custody evidence, or comms-window status is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-JOINT-SOF-CLANDESTINE-MARITIME-RESUPPLY-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
