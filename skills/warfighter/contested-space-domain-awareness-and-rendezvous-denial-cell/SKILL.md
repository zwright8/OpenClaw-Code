---
name: contested-space-domain-awareness-and-rendezvous-denial-cell
description: Support U.S. space warfighters with contested orbital awareness, hostile rendezvous risk detection, and defensive maneuver branch planning.
---

# Contested Space Domain Awareness and Rendezvous Denial Cell

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

## Domain Tool Stack

Use these tool categories by default: space object custody analytics, rendezvous anomaly detection tools, orbital defensive maneuver planners.

## Protocol Profile

Preferred protocol families for this skill: CCSDS, USMTF, STIX/TAXII, API/JSON.

## Domain Toolchain Defaults

- Primary: select a mission-fit tool_suite_id from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md.
- Alternate: select a cross-check tool_suite_id with independent data provenance.
- Degraded: commander-approved manual branch board with UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md to bind concrete tool suites and protocol stacks.
- Use ../_shared/references/domain-tool-packet-library.md and include packet_id=DPL-SPACE-RPO-DENIAL-001 for critical recommendations.
- Include tool_suite_id, protocol_stack_id, packet_id, data freshness (UTC), confidence, and fallback path in each high-impact branch.
- If no direct packet match exists, define a provisional packet with validation_owner and revalidation_utc.

## Guardrails

- Separate facts, assessed judgments, assumptions, and unknowns.
- Flag legal/policy/ROE constraints and coalition interoperability limits early.
- Downgrade to advisory-only when authority, data provenance, or acknowledgment integrity is uncertain.
- Do not fabricate sources, approvals, or operational authorities.

## Domain Toolchain Override (2026-03-12, Expansion Wave XVIII Addendum)

- Add tool_suite_id=ts-space-rendezvous-anomaly-vetting-v1 + protocol_stack_id=ps-space-rendezvous-anomaly-vetting-stack-v1 when defensive maneuver branches depend on validated hostile proximity intent assessments.
- Add tool_suite_id=ts-orbital-custody-sensor-divergence-reconcile-v1 + protocol_stack_id=ps-orbital-custody-sensor-divergence-reconcile-stack-v1 when commander confidence depends on resolving conflicting commercial, coalition, and military track custody.
- Add packet_id=DPL-SPACE-RPO-DENIAL-001 and packet_id=DPL-ORBITAL-CUSTODY-RECONCILE-001 for recommendations that alter maneuver timing, attribution posture, or escalation risk.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLI Addendum)

- Add `tool_suite_id=ts-joint-cislunar-timing-trust-collision-mitigation-v1` + `protocol_stack_id=ps-joint-cislunar-timing-trust-collision-mitigation-stack-v1` when space-domain awareness branches depend on degraded timing trust, custody reconciliation, or conjunction-safe maneuver release in cislunar space.
- Add `packet_id=DPL-JOINT-CISLUNAR-TIMING-COLLISION-MITIGATION-001` for recommendations that alter maneuver timing, custody confidence, or escalation posture.
