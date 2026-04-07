---
name: joint-autonomous-battlefield-mesh-network-key-ceremony-cell
description: Support U.S. warfighter planning and decision support for autonomous battlefield mesh key-ceremony execution, compromise containment, and resilient rekey under contested conditions.
---

# Joint Autonomous Battlefield Mesh Network Key Ceremony Cell

## Mission Scope

- Treat this skill as planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm authorities, trust boundaries, comms constraints, and rekey decision points before analysis.
- Keep products unclassified by default unless handling guidance is explicitly provided.

## Workflow

1. Frame the mission problem using current trust posture, compromise indicators, and timing constraints.
2. Define risk thresholds and branch triggers for immediate rekey, staged rekey, and no-go conditions.
3. Build one recommended option plus at least two alternatives with explicit tradeoffs in resilience, tempo, and operational disruption.
4. Integrate dependencies across C2, cyber, electromagnetic, logistics, and coalition interoperability.
5. Convert recommendations into execution-ready products with owners, suspense dates, and authority checks.

## Required Output Format

1. Situation snapshot.
2. Recommended option and rationale.
3. Alternative options and branch triggers.
4. Decision points now/later/pre-delegated.
5. Staff tasking with owner and deadline.

## Domain Products

Primary products for this skill: mesh trust posture board, key-ceremony execution sequence, compromise containment packet.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: key lifecycle managers, mesh telemetry monitors, compromise forensics queues, interoperability conformance checkers.

## External Tools and Protocol Integration

- Use ../_shared/references/external-tools-protocols.md and ../_shared/references/tool-protocol-playbooks.md for packetized tool execution.
- Use at least one primary source and one cross-check source before final recommendations.
- Prefer protocol families: USMTF, STIX/TAXII, VMF, CoT, API/JSON.
- Include source provenance, refresh time (UTC), assumptions, and confidence.

## Guardrails

- Flag assumptions that exceed available evidence.
- Separate facts, assessments, and unknowns.
- Do not fabricate authorities, sources, or tool outputs.
- Require explicit human command approval for posture-changing recommendations.

## Domain Toolchain Defaults

- Primary: tool_suite_id=ts-joint-autonomous-battlefield-mesh-key-ceremony-v1 with protocol_stack_id=ps-joint-autonomous-battlefield-mesh-key-ceremony-stack-v1.
- Alternate: tool_suite_id=ts-cyber-defense-v1 with protocol_stack_id=ps-cyber-hunt-forward-mission-assurance-stack-v1.
- Degraded: authenticated voice/readback plus UTC acknowledgment ledger and manual fallback board.

## Domain Packet Defaults

- Default packet IDs: DPL-MESH-KEY-CEREMONY-001, DPL-MESH-KEY-CEREMONY-002.
