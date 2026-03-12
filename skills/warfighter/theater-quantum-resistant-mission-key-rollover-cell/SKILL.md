---
name: theater-quantum-resistant-mission-key-rollover-cell
description: Support U.S. warfighter planning for theater-wide quantum-resistant key rollover, fallback cryptography sequencing, and command continuity under active compromise pressure.
---

# Theater Quantum Resistant Mission Key Rollover Cell

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

Primary products for this skill: key rollover readiness board, mission-thread crypto migration matrix, compromised-node isolation branch packet.

## Domain Tool Stack

Use these tool categories by default: key management services, cryptographic posture auditors, mission-network trust-graph dashboards.

## Protocol Profile

Preferred protocol families for this skill: USMTF, STIX/TAXII, NIEM, API/JSON.

## Domain Toolchain Defaults

- Primary: tool_suite_id=ts-quantum-resistant-key-rollover-v1 with protocol_stack_id=ps-quantum-resistant-key-rollover-stack-v1.
- Alternate: select a mission-adjacent suite/stack from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md and explain tradeoffs.
- Degraded: commander-approved manual branch board with UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md to bind concrete tool suites and protocol stacks.
- Use ../_shared/references/domain-tool-packet-library.md and include packet_id=DPL-QUANTUM-KEY-ROLLOVER-001 for critical recommendations.
- Include tool_suite_id, protocol_stack_id, packet_id, data freshness (UTC), confidence, and fallback path in each high-impact branch.
- If no direct packet match exists, define a provisional packet with validation_owner and revalidation_utc.

## Guardrails

- Separate facts, assessed judgments, assumptions, and unknowns.
- Flag legal/policy/ROE constraints and coalition interoperability limits early.
- Downgrade to advisory-only when authority, data provenance, or acknowledgment integrity is uncertain.
- Do not fabricate sources, approvals, or operational authorities.
