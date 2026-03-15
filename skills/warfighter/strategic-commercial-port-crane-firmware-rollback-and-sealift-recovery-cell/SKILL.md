---
name: strategic-commercial-port-crane-firmware-rollback-and-sealift-recovery-cell
description: Coordinate strategic port-crane OT rollback, berth recovery, and sealift throughput restoration for U.S. warfighter force flow. Use when compromised commercial crane firmware or unsafe pier automation threatens military sealift timing.
---

# Strategic Commercial Port Crane Firmware Rollback And Sealift Recovery Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm port authority roles, military cargo priorities, OT safety thresholds, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with crane OT status, berth backlog, cargo priority, and sealift schedule pressure.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, safety, cyber containment, and force-flow disruption.
3. Identify branch/sequel triggers, rollback thresholds, and command approval gates.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: crane rollback decision board, berth-priority ladder, and sealift recovery packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-commercial-port-crane-firmware-rollback-sealift-recovery-v1` with `protocol_stack_id=ps-strategic-commercial-port-crane-firmware-rollback-sealift-recovery-stack-v1`.
- Alternate: select a mission-adjacent sealift, port-recovery, or OT-restoration suite/stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual crane safety board with phased berth release worksheet and UTC berth-acknowledgment logging.

## Domain Packet Defaults

- Default packet ID: `DPL-STRATEGIC-PORT-CRANE-FIRMWARE-ROLLBACK-SEALIFT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: crane OT telemetry board, firmware rollback workflow, pier throughput planner, and sealift berth-priority tracker.
- Preferred protocol profiles for coordination and machine exchange: `STIX/TAXII`, `AIS/NMEA`, `NIMS/ICS`, `USMTF`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, OT safety evidence, or cargo-priority provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag port authority boundaries, worker safety, hazardous cargo handling, and OT rollback hazards before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
