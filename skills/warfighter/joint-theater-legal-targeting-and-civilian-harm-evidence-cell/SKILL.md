---
name: joint-theater-legal-targeting-and-civilian-harm-evidence-cell
description: Support commanders and legal advisors with target legality checks, civilian-harm evidence fusion, and auditable strike-decision records.
---

# Joint Theater Legal Targeting and Civilian Harm Evidence Cell

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

Use these tool categories by default: target legality decision-support boards, civilian-harm evidence fusion ledgers, legal audit-trace validators.

## Protocol Profile

Preferred protocol families for this skill: USMTF, NIEM, STIX/TAXII, API/JSON.

## Domain Toolchain Defaults

- Primary: select a mission-fit tool_suite_id from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md.
- Alternate: select a cross-check tool_suite_id with independent data provenance.
- Degraded: commander-approved manual branch board with UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md to bind concrete tool suites and protocol stacks.
- Use ../_shared/references/domain-tool-packet-library.md and include packet_id=DPL-LEGAL-TARGETING-CIVHARM-EVIDENCE-001 for critical recommendations.
- Include tool_suite_id, protocol_stack_id, packet_id, data freshness (UTC), confidence, and fallback path in each high-impact branch.
- If no direct packet match exists, define a provisional packet with validation_owner and revalidation_utc.

## Guardrails

- Separate facts, assessed judgments, assumptions, and unknowns.
- Flag legal/policy/ROE constraints and coalition interoperability limits early.
- Downgrade to advisory-only when authority, data provenance, or acknowledgment integrity is uncertain.
- Do not fabricate sources, approvals, or operational authorities.

## Domain Toolchain Override (2026-03-12, Expansion Wave XVIII Addendum)

- Add tool_suite_id=ts-legal-targeting-evidence-provenance-ledger-v1 + protocol_stack_id=ps-legal-targeting-evidence-provenance-ledger-stack-v1 when recommendation credibility depends on chain-of-custody integrity across multi-source strike evidence.\n- Add tool_suite_id=ts-civilian-harm-indicator-triangulation-v1 + protocol_stack_id=ps-civilian-harm-indicator-triangulation-stack-v1 when commanders require fast branch updates from NGOs, ISR, and local authority reporting divergence.\n- Add packet_id=DPL-LEGAL-TARGETING-PROVENANCE-001 and packet_id=DPL-CIVILIAN-HARM-TRIANGULATION-001 for recommendations that alter engagement approval, mitigation posture, or disclosure sequencing.
