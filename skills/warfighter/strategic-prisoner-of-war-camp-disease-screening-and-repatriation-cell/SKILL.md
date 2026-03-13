---
name: strategic-prisoner-of-war-camp-disease-screening-and-repatriation-cell
description: Support U.S. warfighter planning and decision support for prisoner of war camp disease screening and repatriation. Use when missions require custody-health synchronization, repatriation prioritization, and authority-gated staff outputs.
---

# Strategic Prisoner Of War Camp Disease Screening And Repatriation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter personnel accountability, preventive medicine, and repatriation operations in this domain.
- Confirm authority, classification and releasability, detainee or POW legal constraints, medical privacy protections, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with camp health status, screening throughput, custody roster integrity, transport capacity, and repatriation authorities.
2. Compare primary, alternate, and degraded repatriation branches with explicit trigger thresholds, outbreak risks, and custody-transfer assumptions.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for screening, isolation, transport, and custody-transfer actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: camp disease screening board, repatriation prioritization ladder, custody-health packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: screening throughput dashboards, custody roster ledgers, transport-priority planners, and legal-handoff workflows.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-pow-camp-disease-screening-repatriation-v1` with `protocol_stack_id=ps-strategic-pow-camp-disease-screening-repatriation-stack-v1`.
- Alternate: custody-health board with manual screening ledger and staged repatriation witness.
- Degraded: high-confidence health-status classes only with paper custody chain and limited transport release.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at custody-health governance, repatriation sequencing, and legal handoff level; do not produce coercive interrogation methods, detainee abuse guidance, or concealment instructions.
- If health data, roster integrity, or repatriation authority status is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-STRATEGIC-POW-CAMP-DISEASE-SCREENING-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
