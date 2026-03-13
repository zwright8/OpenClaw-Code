---
name: coalition-merchant-marine-crew-vetting-and-sealift-assurance-cell
description: Vet coalition merchant crews, reconcile security and sanctions constraints, and protect sealift continuity.
---

# Coalition Merchant Marine Crew Vetting And Sealift Assurance Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter coalition sealift, port security, and maritime sustainment operations in this domain.
- Confirm authority, classification and releasability, coalition caveats, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with crew rosters, voyage demand, port-access rules, sanctions or watchlist constraints, and cargo priorities.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, trust gaps, and throughput risks.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for crew release, port access, and sealift sequencing actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: crew trust board, sealift manning ladder, port-release packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: crew-vetting ledgers, sealift manning boards, port-access workflows, and sanctions-screening services.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when coalition release, port security, and sealift continuity all affect the decision.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-merchant-marine-crew-vetting-sealift-assurance-v1` with `protocol_stack_id=ps-coalition-merchant-marine-crew-vetting-sealift-assurance-stack-v1`.
- Alternate: coalition liaison screening board with manual manifest reconciliation and staged voyage release.
- Degraded: mission-essential voyages only with dual-approval crew release and constrained coalition data sharing.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at crew trust, port-access, and sealift-governance level; do not provide offensive interdiction tactics or evasion guidance.
- If crew identity, port-security posture, or coalition acknowledgment status is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-COALITION-MERCHANT-MARINE-CREW-VETTING-SEALIFT-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
