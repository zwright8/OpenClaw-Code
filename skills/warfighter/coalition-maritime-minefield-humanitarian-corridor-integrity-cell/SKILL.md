---
name: coalition-maritime-minefield-humanitarian-corridor-integrity-cell
description: Protect humanitarian sea corridors near maritime mine threats while preserving coalition control and auditability. Use when civilian movement, aid delivery, and mine risk must be balanced under joint oversight.
---

# Coalition Maritime Minefield Humanitarian Corridor Integrity Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm corridor purpose, mine-threat posture, coalition caveats, civilian protection constraints, and decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the corridor, mine-threat picture, escort posture, and humanitarian movement demand.
2. Build protected-route, hold, reroute, clearance, and closure branches with explicit civilian-risk and military-risk tradeoffs.
3. Bind each recommendation to concrete maritime COP, mine-clearance, and corridor-governance tools plus packetized outputs.
4. Publish degraded-mode branches when route confidence, escort availability, or coalition clearance integrity falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended corridor branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Corridor packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: humanitarian sea-corridor integrity board, mine-threat confidence ladder, and convoy/escort release matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-minefield-humanitarian-corridor-integrity-v1` with `protocol_stack_id=ps-coalition-minefield-humanitarian-corridor-integrity-stack-v1`.
- Alternate: liaison-cleared sailing windows plus manual route-risk board.
- Degraded: high-confidence convoys only with fixed escort windows and recurring UTC refresh.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-MINEFIELD-HUMCOR-001` for critical recommendations.
- Prioritize these protocol families for this domain: `AIS/NMEA`, `OGC`, `USMTF`, and `NATO APP-11/ADatP-3`.
- Include source system, refresh UTC, confidence, civilian-risk notes, and coalition clearance gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run interoperability and route-assurance checks from `../_shared/references/mission-assurance-checklist.md`.
- If corridor status, mine clearance, or coalition release authority is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not fabricate route safety, minefield status, or humanitarian clearances.
- Separate confirmed mine risk from modeled threat areas.
- Surface civilian-harm, maritime-law, and coalition coordination constraints early.
