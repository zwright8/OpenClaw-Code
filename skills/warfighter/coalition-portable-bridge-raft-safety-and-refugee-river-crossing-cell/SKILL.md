---
name: coalition-portable-bridge-raft-safety-and-refugee-river-crossing-cell
description: Support U.S. warfighter planning and decision support for coalition portable bridge or raft safety and refugee river crossing. Use when missions require life-safety throughput, engineer synchronization, and authority-gated staff outputs.
---

# Coalition Portable Bridge Raft Safety And Refugee River Crossing Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter coalition engineer, humanitarian, and river-crossing safety operations in this domain.
- Confirm authority, classification and releasability, humanitarian constraints, host-nation permissions, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with river conditions, crossing-site geometry, raft and bridge capacity, population pressure, and legal-handoff requirements.
2. Compare primary, alternate, and degraded crossing branches with explicit trigger thresholds, life-safety limits, and congestion risks.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for site release, throughput control, and humanitarian handoff actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: river crossing safety board, throughput ladder, legal-handoff packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: hydrology and current tools, bridge or raft capacity calculators, humanitarian flow boards, and coalition legal-handoff workflows.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-portable-bridge-raft-refugee-crossing-safety-v1` with `protocol_stack_id=ps-coalition-portable-bridge-raft-refugee-crossing-safety-stack-v1`.
- Alternate: engineer crossing board with manual flow control and staged legal-handoff verification.
- Degraded: life-safety crossings only with visual current checks, paper manifests, and fixed site limits.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at life-safety throughput, site release, and legal-handoff governance level; do not produce coercive displacement plans, tactical breaching instructions, or targeting guidance.
- If hydrology confidence, bridge capacity, or legal-handoff status is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-COALITION-BRIDGE-RAFT-REFUGEE-CROSSING-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
