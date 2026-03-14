---
name: multi-theater-maritime-interdiction-evidence-and-sanctions-cell
description: Harmonize legal evidence and sanctions data for maritime interdiction campaigns spanning multiple theaters.
---

# Multi-Theater Maritime Interdiction Evidence And Sanctions Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter maritime interdiction governance, coalition legal integration, and sanctions enforcement operations in this domain.
- Confirm authority, classification and releasability, legal sufficiency thresholds, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with vessel histories, sanctions triggers, evidence custody status, theater caveats, and interception windows.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, legal sufficiency risks, and escalation tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for boarding release, sanctions action, and tribunal handoff actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: evidence harmonization board, sanctions decision ladder, interdiction release packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: vessel-custody ledgers, sanctions case boards, evidence schema translators, and boarding action workflows.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when vessel custody, sanctions policy, and coalition caveat branches interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-multi-theater-maritime-interdiction-evidence-sanctions-v1` with `protocol_stack_id=ps-multi-theater-maritime-interdiction-evidence-sanctions-stack-v1`.
- Alternate: manual legal review board with theater-by-theater caveat reconciliation and delayed release.
- Degraded: advisory-only target packages and delayed interdiction until legal sufficiency is confirmed.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at legal-governance, sanctions-evidence, and release-authority level; do not provide boarding tactics, coercive questioning, or sanctions-evasion assistance.
- If custody evidence, legal authority, or sanctions data is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-MULTI-THEATER-MARITIME-INTERDICTION-EVIDENCE-SANCTIONS-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
