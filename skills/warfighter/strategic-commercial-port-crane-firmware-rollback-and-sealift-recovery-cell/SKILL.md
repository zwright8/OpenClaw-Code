---
name: strategic-commercial-port-crane-firmware-rollback-and-sealift-recovery-cell
description: Recover commercial port crane OT through trusted firmware rollback while protecting military sealift throughput.
---

# Strategic Commercial Port Crane Firmware Rollback And Sealift Recovery Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter strategic sealift, port recovery, and cyber-physical sustainment operations in this domain.
- Confirm authority, classification and releasability, OT safety limits, and commander decision points before producing recommendations.
- Keep outputs advisory unless explicit command approval is documented.

## Workflow

1. Build the mission picture with OT alert status, firmware baselines, crane health, berth schedules, and sealift priorities.
2. Compare primary, alternate, and degraded branches with explicit trigger thresholds, safety risks, and throughput tradeoffs.
3. Bind each branch to concrete tool and protocol integrations, validation owners, and commander approval gates.
4. Publish commander decision points, staff tasking, and revalidation windows for rollback release, pier sequencing, and sealift recovery actions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate and degraded branches with trigger thresholds.
4. Decision authorities, timing gates, and escalation criteria.
5. Staff actions with owner, suspense, and verification method.

## Domain Products

Primary products: crane rollback board, pier recovery ladder, sealift recovery packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Prioritize these tool families: crane OT telemetry boards, firmware rollback workflows, pier throughput planners, and sealift berth-priority trackers.
- Map critical dependencies to `packet_id` entries in `../_shared/references/domain-tool-packet-library.md`; if missing, define provisional packets with validation owners.
- Bind each recommendation to concrete suite and stack entries in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Select or derive a matching toolchain profile from `../_shared/references/joint-operations-external-toolchain-profiles.md` when OT recovery, berth release, and military sealift priorities interact.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-commercial-port-crane-firmware-rollback-sealift-recovery-v1` with `protocol_stack_id=ps-strategic-commercial-port-crane-firmware-rollback-sealift-recovery-stack-v1`.
- Alternate: manual crane safety board with phased berth release and reduced pier tempo.
- Degraded: defense-critical cargo only with crane-by-crane manual release and explicit OT safety concurrence.

## Guardrails

- Separate observed facts, assessed confidence, and unknowns.
- Keep outputs at OT recovery, berth-priority, and sealift-governance level; do not provide exploit code, persistence methods, or unsafe OT manipulation guidance.
- If OT integrity, crane safety, or berth-status data is stale or incomplete, mark outputs `provisional` and provide a constrained branch.
- Escalate high-consequence recommendations using `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.

## Domain Packet Defaults

- Default packet ID: `DPL-STRATEGIC-PORT-CRANE-FIRMWARE-ROLLBACK-SEALIFT-001`.
- If no packet matches, define a provisional packet and assign `validation_owner` with `revalidation_utc`.

## Operational Execution Hardening

- Require `ack_chain_status=verified` for mission-critical exchanges.
- Require `trust_score >= 0.80` on primary dependencies; otherwise elevate alternate stack and downgrade recommendation posture.
- End every deliverable with `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` tied to authority and protocol checks.
