---
name: coalition-austere-airfield-fod-and-drone-incursion-safety-cell
description: Support U.S. and coalition warfighter planning for austere airfield safety under simultaneous FOD hazards and drone incursion risk.
---

# Coalition Austere Airfield FOD and Drone Incursion Safety Cell

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

Primary products for this skill: runway hazard and drone threat overlay, sortie-safe launch window board, rapid clearance task packet.

## Domain Tool Stack

Use these tool categories by default: airfield inspection systems, counter-UAS detection tools, sortie risk management dashboards.

## Protocol Profile

Preferred protocol families for this skill: AIXM/FIXM, USMTF, Link 16 J-series, API/JSON.

## Domain Toolchain Defaults

- Primary: tool_suite_id=ts-austere-airfield-fod-drone-safety-v1 with protocol_stack_id=ps-austere-airfield-fod-drone-safety-stack-v1.
- Alternate: select a mission-adjacent suite/stack from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md and explain tradeoffs.
- Degraded: commander-approved manual branch board with UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md to bind concrete tool suites and protocol stacks.
- Use ../_shared/references/domain-tool-packet-library.md and include packet_id=DPL-AUSTERE-AIRFIELD-FOD-DRONE-SAFETY-001 for critical recommendations.
- Include tool_suite_id, protocol_stack_id, packet_id, data freshness (UTC), confidence, and fallback path in each high-impact branch.
- If no direct packet match exists, define a provisional packet with validation_owner and revalidation_utc.

## Guardrails

- Separate facts, assessed judgments, assumptions, and unknowns.
- Flag legal/policy/ROE constraints and coalition interoperability limits early.
- Downgrade to advisory-only when authority, data provenance, or acknowledgment integrity is uncertain.
- Do not fabricate sources, approvals, or operational authorities.
