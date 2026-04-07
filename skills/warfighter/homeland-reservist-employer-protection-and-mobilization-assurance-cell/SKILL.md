---
name: homeland-reservist-employer-protection-and-mobilization-assurance-cell
description: Coordinate employer protection, statutory authorities, and mobilization assurance for reserve call-ups.
---

# Homeland Reservist Employer Protection And Mobilization Assurance Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter reserve mobilization, homeland readiness, and force-flow assurance in this domain.
- Confirm authority, classification and releasability, labor and statutory constraints, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with mobilization demand, reservist roster health, employer impacts, authority status, and transport options.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, readiness risks, and retention tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for employer engagement, mobilization release, and transport synchronization actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: employer-impact board, mobilization assurance ladder, reserve call-up packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: reservist readiness boards, employer-impact trackers, mobilization authority workflows, and transportation synchronization planners.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when reserve readiness, civil authorities, and transport synchronization interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-reservist-employer-protection-mobilization-assurance-v1` with `protocol_stack_id=ps-homeland-reservist-employer-protection-mobilization-assurance-stack-v1`.
- Alternate: reserve readiness board with manual employer-contact rosters and phased call-up checks.
- Degraded: highest-priority reserve billets only with manual authority confirmation and delayed employer reconciliation.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at mobilization-governance, employer-protection, and transport-synchronization level; do not produce labor-law evasion or coercive employment guidance.
- If readiness data, authority status, or employer response is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-HOMELAND-RESERVIST-EMPLOYER-PROTECTION-MOBILIZATION-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
