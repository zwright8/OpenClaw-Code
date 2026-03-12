---
name: joint-adversary-drone-fiber-backhaul-hunt-and-neutralization-cell
description: Support U.S. warfighter planning for detecting and neutralizing adversary drone-linked fiber backhaul relay networks.
---

# Joint Adversary Drone Fiber Backhaul Hunt and Neutralization Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm authorities, legal boundaries, coalition caveats, and commander decision points before recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance.

## Workflow

1. Build a mission snapshot with drone/fiber relay threat indicators, terrain constraints, and mission-thread risk.
2. Create branch options with explicit tradeoffs in detection confidence, neutralization tempo, and collateral/escalation risk.
3. Select toolchain profile (primary, alternate, degraded) and protocol/message path.
4. Map tool outputs to command decisions with confidence scoring and invalidation gates.
5. Produce recommendations with owner-assigned actions, suspense, and revalidation checks.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternatives and trigger conditions.
4. Decision points and approval gates.
5. Staff tasking with suspense.

## Domain Tool Stack

Use these tool categories by default: counter-UAS analytics, fiber backhaul anomaly mapping, and cross-domain neutralization coordination boards.

## Protocol Profile

Preferred protocol families for this skill: STIX/TAXII, Link 16 J-series, USMTF, CoT, API/JSON.

## Domain Toolchain Defaults

- Primary: select a mission-fit tool_suite_id from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md.
- Alternate: select a cross-check tool_suite_id with independent provenance.
- Degraded: commander-approved manual threat board with UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md for concrete tool suites and protocol stacks.
- Use ../_shared/references/domain-tool-packet-library.md and include packet_id=DPL-JOINT-DRONE-FIBER-BACKHAUL-HUNT-001 for critical recommendations.
- Include tool_suite_id, protocol_stack_id, packet_id, data freshness (UTC), confidence, and fallback path for each high-impact branch.
- If no packet matches, define a provisional packet with validation_owner and revalidation_utc.

## Guardrails

- Separate facts, assessed judgments, assumptions, and unknowns.
- Flag legal/policy/ROE constraints and coalition interoperability limits early.
- Downgrade to advisory-only when authority, provenance, or acknowledgment integrity is uncertain.
- Do not fabricate sources, approvals, or operational authorities.
