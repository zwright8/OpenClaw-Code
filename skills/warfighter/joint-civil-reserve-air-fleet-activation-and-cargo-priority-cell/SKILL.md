---
name: joint-civil-reserve-air-fleet-activation-and-cargo-priority-cell
description: Activate and prioritize Civil Reserve Air Fleet and commercial lift capacity for deployment, evacuation, or sustainment surges. Use when military airlift is insufficient or civil-airlift constraints must be synchronized.
---

# Joint Civil Reserve Air Fleet Activation And Cargo Priority Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm activation authority, cargo mix, diplomatic constraints, crew-duty limits, and decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the lift shortfall, eligible civil carriers, cargo and passenger priorities, and activation authorities.
2. Build activate, defer, split-load, reroute, and attrit-risk branches with explicit throughput and diplomatic tradeoffs.
3. Bind each recommendation to airlift scheduling, cargo visibility, and host-nation clearance tools plus protocolized outputs.
4. Publish degraded-mode branches when carrier participation, ramp capacity, or clearance timelines fall below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended activation branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Civil reserve air fleet packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: airlift activation matrix, cargo-priority ladder, and carrier-commitment risk board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-civil-reserve-air-fleet-activation-v1` with `protocol_stack_id=ps-joint-civil-reserve-air-fleet-activation-stack-v1`.
- Alternate: air mobility command board plus civil-carrier commitment tracker.
- Degraded: manual cargo-priority board with voice-confirmed carrier and ramp status.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-CIVIL-RESERVE-AIR-FLEET-001` for critical recommendations.
- Prioritize these protocol families for this domain: `AIXM/FIXM`, `IATA Cargo-IMP`, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, cargo backlog, and unresolved diplomatic-clearance gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If activation authority, carrier acceptance, or diplomatic clearance status is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate carrier commitments, airfield slots, or diplomatic approvals.
- Separate projected throughput from confirmed tail availability.
- Flag hazardous cargo, medical-evacuation, and family-movement constraints early.
