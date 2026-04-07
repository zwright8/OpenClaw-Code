---
name: theater-autonomous-rail-yard-hazmat-collision-and-force-flow-recovery-cell
description: Support U.S. warfighter planning for autonomous rail-yard collision response, hazmat containment, and force-flow restoration.
---

# Theater Autonomous Rail Yard Hazmat Collision and Force-Flow Recovery Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm authorities, mission objectives, coalition constraints, and commander decision points before recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance.

## Workflow

1. Build mission context with current operational posture, threat indicators, and critical dependency paths.
2. Generate primary and alternate branches with explicit tradeoffs in tempo, survivability, sustainment burden, and escalation risk.
3. Select primary, alternate, and degraded toolchain paths with protocol bindings and authority gates.
4. Map each external-tool output to commander decision points with confidence, assumptions, and invalidation triggers.
5. Deliver execution-ready recommendations with owners, suspense, and revalidation checkpoints.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternatives with trigger conditions.
4. Decision points and approval gates.
5. Staff tasking with suspense.

## Domain Tool Stack

Use these tool categories by default: rail-yard digital twins, hazmat plume containment orchestrators, and force-flow restoration schedulers.

## Protocol Profile

Preferred protocol families for this skill: NIMS/ICS, EDXL-DE/CAP, USMTF, NIEM, API/JSON.

## Domain Toolchain Defaults

- Primary: select a mission-fit tool_suite_id from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md.
- Alternate: select a cross-check tool_suite_id with independent provenance.
- Degraded: commander-approved manual decision board with UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md for concrete tool suites and protocol stacks.
- Use ../_shared/references/domain-tool-packet-library.md and include packet_id=DPL-THEATER-AUTONOMOUS-RAIL-YARD-HAZMAT-COLLISION-FORCE-FLOW-RECOVERY-001 for critical recommendations.
- Include tool_suite_id, protocol_stack_id, packet_id, data freshness (UTC), confidence, and fallback path for each high-impact branch.
- If no packet matches, define a provisional packet with validation_owner and revalidation_utc.

## Guardrails

- Separate facts, assessed judgments, assumptions, and unknowns.
- Flag legal, policy, ROE, and interoperability constraints early.
- Downgrade to advisory-only when authority, provenance, or acknowledgment integrity is uncertain.
- Do not fabricate sources, approvals, or operational authorities.
