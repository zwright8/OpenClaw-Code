---
name: strategic-on-orbit-solar-array-shadowing-and-battery-load-shed-cell
description: Manage solar-array shadowing, battery depletion, and load-shed priorities for strategic on-orbit assets. Use when eclipses, degradation, or maneuver schedules threaten mission continuity.
---

# Strategic On Orbit Solar Array Shadowing And Battery Load Shed Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm satellite mission priorities, battery margins, eclipse geometry, and release authorities before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the power budget, eclipse windows, load priorities, and thermal or attitude constraints.
2. Build one recommended power-preservation branch plus alternatives to shed, defer, maneuver, or reassign mission loads.
3. Bind each recommendation to spacecraft power-health, ephemeris, and mission-coverage tools with explicit protocolized outputs.
4. Publish degraded-mode branches when telemetry confidence, maneuver clearance, or battery reserve falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended load-shed branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now, next, and pre-delegated.
5. Staff tasking by owner and suspense.
6. On-orbit power packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: spacecraft power-priority ladder, eclipse exposure matrix, battery reserve decision board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-on-orbit-solar-array-battery-load-shed-v1` with `protocol_stack_id=ps-strategic-on-orbit-solar-array-battery-load-shed-stack-v1`.
- Alternate: mission-coverage adjudication board plus manual power-budget worksheet.
- Degraded: mission-essential payloads only with commander-approved power-shed windows and UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-ON-ORBIT-SOLAR-BATTERY-001` for critical recommendations.
- Prioritize these protocol families for this domain: `CCSDS`, signed telemetry manifests, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, power margin, and unresolved attitude or ephemeris gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If power telemetry, maneuver authority, or mission-priority adjudication is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate battery state, power draw, or command authority.
- Separate forecast eclipse or shadowing risk from confirmed solar-array degradation.
- Flag conjunction, thermal, and protected-payload constraints early.
