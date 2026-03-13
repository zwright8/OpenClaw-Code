---
name: special-operations-low-signature-logistics-interop-cell
description: Support SOF elements with low-signature logistics planning, denied-area resupply interop, and mission-compromise risk controls.
---

# Special Operations Low Signature Logistics Interop Cell

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

Use these tool categories by default: low-signature route planners, clandestine sustainment ledgers, compromise-risk analytics.

## Protocol Profile

Preferred protocol families for this skill: USMTF, VMF, CoT, API/JSON.

## Domain Toolchain Defaults

- Primary: select a mission-fit tool_suite_id from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md.
- Alternate: select a cross-check tool_suite_id with independent data provenance.
- Degraded: commander-approved manual branch board with UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md to bind concrete tool suites and protocol stacks.
- Use ../_shared/references/domain-tool-packet-library.md and include packet_id=DPL-SOF-LOWSIG-LOGISTICS-INTEROP-001 for critical recommendations.
- Include tool_suite_id, protocol_stack_id, packet_id, data freshness (UTC), confidence, and fallback path in each high-impact branch.
- If no direct packet match exists, define a provisional packet with validation_owner and revalidation_utc.

## Guardrails

- Separate facts, assessed judgments, assumptions, and unknowns.
- Flag legal/policy/ROE constraints and coalition interoperability limits early.
- Downgrade to advisory-only when authority, data provenance, or acknowledgment integrity is uncertain.
- Do not fabricate sources, approvals, or operational authorities.

## Domain Toolchain Override (2026-03-12, Expansion Wave XVIII Addendum)

- Add `tool_suite_id=ts-low-signature-logistics-cross-domain-sync-v1` with `protocol_stack_id=ps-low-signature-logistics-cross-domain-sync-stack-v1` when SOF sustainment requires tightly synchronized handoffs across denied air, ground, and maritime nodes.
- Add `tool_suite_id=ts-denied-terrain-cache-exposure-risk-audit-v1` with `protocol_stack_id=ps-denied-terrain-cache-exposure-risk-audit-stack-v1` when branch options depend on cache survivability and adversary pattern-of-life detection risk.
- Add `packet_id=DPL-LOW-SIGNATURE-LOG-INTEROP-001` and `packet_id=DPL-CACHE-EXPOSURE-RISK-001` for recommendations that alter resupply cadence, route discipline, or exposure posture.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXIX Addendum)

- Add `tool_suite_id=ts-joint-sof-clandestine-maritime-resupply-signature-control-v1` with `protocol_stack_id=ps-joint-sof-clandestine-maritime-resupply-signature-control-stack-v1` when low-signature logistics planning depends on littoral route exposure, maritime custody handoffs, or comms-window timing discipline.
- Add `packet_id=DPL-JOINT-SOF-CLANDESTINE-MARITIME-RESUPPLY-001` for recommendations that materially change low-signature resupply timing, maritime route confidence, or custody-assurance posture.
