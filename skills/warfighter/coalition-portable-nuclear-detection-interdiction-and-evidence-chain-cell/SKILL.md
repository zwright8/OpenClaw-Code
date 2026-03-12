---
name: coalition-portable-nuclear-detection-interdiction-and-evidence-chain-cell
description: Support coalition warfighter planning for portable nuclear device detection, interdiction, and evidence-chain integrity under high-consequence conditions.
---

# Coalition Portable Nuclear Detection Interdiction and Evidence Chain Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for coalition warfighter missions in this domain.
- Confirm legal authorities, interagency roles, escalation limits, and commander decision points before recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance.

## Workflow

1. Build mission context with current detection posture, threat indicators, and jurisdictional constraints.
2. Generate branches with explicit tradeoffs in interdiction tempo, contamination risk, and strategic escalation.
3. Select primary, alternate, and degraded toolchain paths with protocol and evidence-chain binding.
4. Map outputs to command decisions with confidence and validation gates.
5. Deliver execution-ready recommendations with owner-assigned actions and suspense.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternatives and trigger conditions.
4. Decision points and approval gates.
5. Staff tasking with suspense.

## Domain Tool Stack

Use these tool categories by default: radiological detection fusion, interdiction command workflows, and legal-evidence custody systems.

## Protocol Profile

Preferred protocol families for this skill: USMTF, NIEM, CJIS, NIMS/ICS, API/JSON.

## Domain Toolchain Defaults

- Primary: select a mission-fit tool_suite_id from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md.
- Alternate: select a cross-check tool_suite_id with independent provenance.
- Degraded: commander-approved manual detection and evidence ledger with UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md for concrete tool suites and protocol stacks.
- Use ../_shared/references/domain-tool-packet-library.md and include packet_id=DPL-COALITION-PORTABLE-NUCLEAR-INTERDICTION-001 for critical recommendations.
- Include tool_suite_id, protocol_stack_id, packet_id, data freshness (UTC), confidence, and fallback path for each high-impact branch.
- If no packet matches, define a provisional packet with validation_owner and revalidation_utc.

## Guardrails

- Separate facts, assessed judgments, assumptions, and unknowns.
- Flag legal/policy/ROE constraints and coalition interoperability limits early.
- Downgrade to advisory-only when authority, provenance, or acknowledgment integrity is uncertain.
- Do not fabricate sources, approvals, or operational authorities.
