---
name: coalition-ballistic-missile-civil-warning-and-shelter-synchronization-cell
description: Support U.S. and coalition warfighter planning for synchronized ballistic-missile public warning and sheltering continuity without degrading military command tempo.
---

# Coalition Ballistic Missile Civil Warning and Shelter Synchronization Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm echelon, authorities, timeline, and mission decision points before generating recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance.

## Workflow

1. Build a mission snapshot with current status, threat posture, support constraints, and commander priorities.
2. Define branch options with explicit tradeoffs in survivability, tempo, sustainment burden, and escalation risk.
3. Select external toolchain configuration (primary, alternate, degraded) and state the protocol/message path.
4. Map each tool output to a commander decision point with confidence, assumptions, and validation gates.
5. Produce commander-facing recommendations plus staff actions with owners, suspense, and branch triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternatives and trigger conditions.
4. Decision points and approval gates.
5. Staff tasking with suspense.

## Domain Products

Primary products for this skill: civil warning synchronization timeline, shelter capacity stress map, coalition warning authority matrix.

## Domain Tool Stack

Use these tool categories by default: missile warning fusion boards, civil alerting orchestration systems, shelter occupancy telemetry dashboards.

## Protocol Profile

Preferred protocol families for this skill: Link 16 J-series, CAP, NIEM, USMTF, API/JSON.

## Domain Toolchain Defaults

- Primary: tool_suite_id=ts-coalition-missile-warning-shelter-sync-v1 with protocol_stack_id=ps-coalition-missile-warning-shelter-sync-stack-v1.
- Alternate: select a mission-adjacent suite/stack from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md and explain tradeoffs.
- Degraded: commander-approved manual branch board with UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md to bind concrete tool suites and protocol stacks.
- Use ../_shared/references/domain-tool-packet-library.md and include packet_id=DPL-COALITION-MISSILE-WARNING-SHELTER-001 for critical recommendations.
- Include tool_suite_id, protocol_stack_id, packet_id, data freshness (UTC), confidence, and fallback path in each high-impact branch.
- If no direct packet match exists, define a provisional packet with validation_owner and revalidation_utc.

## Guardrails

- Separate facts, assessed judgments, assumptions, and unknowns.
- Flag legal/policy/ROE constraints and coalition interoperability limits early.
- Downgrade to advisory-only when authority, data provenance, or acknowledgment integrity is uncertain.
- Do not fabricate sources, approvals, or operational authorities.
